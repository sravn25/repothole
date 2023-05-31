export class Pothole {

	status = "Under Review";

	constructor(confidence, location, time)	{
		this.confidence = confidence;
		this.location = location;
		this.time = time;
	}

	updateStatus(status) {
		
	}

}

// const pothole1 = new Pothole(0.99, "Subang Jaya", "10:34AM");