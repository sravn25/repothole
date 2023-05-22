import * as tf from "@tensorflow/tfjs";

const { layers, image, tensor } = require("@tensorflow/tfjs");

// export const runPrediction = async (imageRef) => {
let model = null;

export const loadModel = async () => {
  // setIsModelLoading(true);
  try {
    // Register the custom layer before loading the model

    class RandomFlip extends layers.Layer {
      constructor(config) {
        super(config);
        this.mode = config.mode;
        this.inputShape = [1, 300, 450, 3];
      }

      call(inputs, kwargs) {
        if (!this.inputShape || this.inputShape.length === 0) {
          // Handle the case when inputShape is undefined or empty
          console.log("Current input shape:", inputs.shape);
          throw new Error("Invalid input shape");
        }

        const [_, height, width, channels] = this.inputShape;

        const reshapedInputs = tf.reshape(inputs, [1, height, width, channels]);
        console.log(`reshapedInputShape: ${reshapedInputs}`);

        console.log("inputs shape:", inputs.shape);
        console.log("reshapedInputs shape:", reshapedInputs.shape);
        console.log("reshapedInputs size:", reshapedInputs.size);

        // Convert reshapedInputs tensor to an array for logging
        reshapedInputs
          .array()
          .then((array) => console.log("reshapedInputs array:", array));


        // Resize the inputs to the desired dimensions
        const resizedInputs = tf.image.resizeBilinear(reshapedInputs, [
          height,
          width,
        ]);

        // Apply random flip to the resized inputs
        const flippedInputs = tf.image.flipLeftRight(resizedInputs.squeeze());

        return flippedInputs;
      }

      static get className() {
        return "RandomFlip";
      }

      getConfig() {
        const config = {
          mode: this.mode,
          inputShape: this.inputShape,
        };
        const baseConfig = super.getConfig();
        Object.assign(config, baseConfig);
        return config;
      }
    }

    class RandomRotation extends layers.Layer {
      constructor(config) {
        super(config);
        this.rotationRange = config.rotationRange;
      }

      call(inputs, kwargs) {
        // Apply random rotation to the inputs
        const rotatedInputs = tf.tidy(() => {
          const angles = tf.randomUniform(
            inputs.shape.slice(0, 1),
            -this.rotationRange,
            this.rotationRange
          );
          return image.applyRotation(inputs, angles);
        });

        return rotatedInputs;
      }

      static get className() {
        return "RandomRotation";
      }

      getConfig() {
        const config = {
          rotationRange: this.rotationRange,
        };
        const baseConfig = super.getConfig();
        Object.assign(config, baseConfig);
        return config;
      }
    }

    class RandomZoom extends layers.Layer {
      constructor(config) {
        super(config);
        this.heightFactor = config.heightFactor;
        this.widthFactor = config.widthFactor;
      }

      call(inputs, kwargs) {
        // Apply random zoom to the inputs
        return tf.image.randomZoom(inputs, [
          this.heightFactor,
          this.widthFactor,
        ]);
      }

      static get className() {
        return "RandomZoom";
      }

      getConfig() {
        const config = {
          heightFactor: this.heightFactor,
          widthFactor: this.widthFactor,
        };
        const baseConfig = super.getConfig();
        Object.assign(config, baseConfig);
        return config;
      }
    }

    tf.serialization.registerClass(RandomFlip);
    tf.serialization.registerClass(RandomRotation);
    tf.serialization.registerClass(RandomZoom);

    // Load or import the model that contains the custom layer
    //const model = await tf.loadLayersModel('path/to/model.json');
    model = await tf.loadLayersModel(
      "http://localhost:3000/tfjs_model/model.json"
    );
  } catch (error) {
    console.log(error);
    console.log("cant load model")
    // setIsModelLoading(false);
  }
};

// dummy function (use this to test)
// remember to replace the import {loadModel} to {load} in Uploader.jsx
export const load = async () => {
  try {
    model = await tf.loadLayersModel("http://localhost:3000/tfjs_model/model.json")
  } catch (error) {
    console.log(error);
  }
}

export const identify = async (imageURL) => {
  if (!model) {
    console.log("Model not loaded");
    return;
  }
  const imageTensor = await loadImage(imageURL);
  if (imageTensor == null) {
    console.log("Error: Unable to create image tensor");
    return;
  }

  // Validate the input shape
  if (imageTensor.shape.length !== 3) {
    console.log("Invalid input shape");
    return;
  }
  // Resize the image to the desired input shape [300, 450]
  const resizedImg = tf.image.resizeBilinear(imageTensor, [300, 450]);

  // Reshape the image to match the model's expected input shape [1, 300, 450, 3]
  const reshapedImg = resizedImg.reshape([1, 300, 450, 3]);

  // add extra dimension
  // const expandImgTensor = resizedImg.expandDims();

  console.log(`reshaped image: ${reshapedImg}`);
  console.log(`reshaped size: ${reshapedImg.rank}`);
  // console.log(`added dim: ${expandImgTensor.rank}`)

  await predict(reshapedImg);
};

const loadImage = async (imageURL) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);

      const imageData = context.getImageData(0, 0, img.width, img.height);
      const imageTensor = tf.browser.fromPixels(imageData);

      console.log(`Image tensor: ${imageTensor}`);
      resolve(imageTensor);

      /*
      if (imageTensor == null) {
        console.log("Error: Unable to read image data");
        return;
      }
      */
    };
    img.onerror = () => reject(new Error("Error: Failed to load image"));
    img.src = imageURL;
  });
};

const predict = async (imageTensor) => {
  try {
    const prediction = model.predict(imageTensor);
    const predictionShape = prediction.shape;

    if (predictionShape == null) {
      console.log("Error: Unable to read predictionShape");
      return;
    }

    imageTensor.dispose();
    // resizedImg.dispose();
    // reshapedImg.dispose();
    console.log(prediction);
  } catch (error) {
    console.log(error);
    console.log("Error: TensorFlow Operation Failed");
  }
};
