import * as tf from "@tensorflow/tfjs";

let model = null;
let output = null;

// Need to write a function to validate the output
// only want pothole output, if plain just reset it to empty
// must run once during every prediction to keep the output clean
const validateOutput = (score) => score === 1 ? true : false;


export const getOutput = () => {
  if (output) return output;
};

// loads NewTFJS as graph model 
export const load = async () => {
  try {
    model = await tf.loadGraphModel("http://localhost:3000/NewTFJS/model.json");
  } catch (error) {
    console.log(error);
  }
};

// Reshape image and run prediction function
export const identify = async (imageURL) => {
  if (!model) {
    console.log("Model not loaded");
    return;
  }

  // load image as tensor
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

  console.log(`reshaped image: ${reshapedImg}`);
  console.log(`reshaped size: ${reshapedImg.rank}`);
  console.log("Reshaped image shape:", reshapedImg.shape);

  await predict(reshapedImg);
};

// convert image and return tensor
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
    };
    img.onerror = () => reject(new Error("Error: Failed to load image"));
    img.src = imageURL;
  });
};

// run the prediction
export const predict = async (imageTensor) => {
  try {
    const prediction = await model.predict(imageTensor);
    const softmaxPrediction = tf.softmax(prediction); // apply softmax function
    const predictionScores = softmaxPrediction.arraySync();
    const classes = ['plain', 'potholes']; // classes for result

    if (!predictionScores) {
      console.log("Error: Unable to retrieve prediction values");
      return;
    }

    // index of class with highest probability
    const maxScoreIndex = tf.argMax(softmaxPrediction, 1).dataSync()[0];

    // retrieve class label and score
    const predictedClass = classes[maxScoreIndex];
    const predictedScore = predictionScores[0][maxScoreIndex];

    imageTensor.dispose();
    output = `Predicted class: ${predictedClass}\n
    Predicted Score: ${predictedScore}`;
    console.log(output);
  } catch (error) {
    console.log(error);
    console.log("Error: TensorFlow Operation Failed");
  }
};

/*

// .h5 keras model (does not work)

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
    model = await tf.loadGraphModel(
      //"http://localhost:3000/TFJSori/model.json"
      "http://localhost:3000/NewTFJS/model.json"
    );
  } catch (error) {
    console.log(error);
    console.log("cant load model");
    // setIsModelLoading(false);
  }
};
*/