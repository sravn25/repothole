export class Pothole {
  statusArr = [
    "Under Review",
    "In Progress",
    "Completed",
    "Cancelled",
  ];

  constructor(location, time, score, status, image) {
    this.location = location; //geolocation
    this.time = time; // GMT time
    this.score = score; // confidence score
		this.status = this.statusArr[status]; // index in status array
    this.image = image; // image URL
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
  
}
