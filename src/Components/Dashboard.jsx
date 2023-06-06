import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import {
  Image,
} from "@mantine/core";


const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const Dashboard = () => {
  const [data, setData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });

  // fetch data bah
  useEffect(() => {
    const database = getDatabase();
    const potholeRef = ref(database, "pothole");

    const onDataChange = (snapshot) => {
      if (snapshot.exists()) {
        const fetchedData = snapshot.val();
        setData({ ...fetchedData });
        // Set the image URL
        setImageUrl(fetchedData.imageURL);
      } else {
        setData({});
        setImageUrl("");
      }
    };

    onValue(potholeRef, onDataChange);

    return () => {
      setData({});
      setImageUrl("");
    };
  }, []);

  // Update data function
  const updateData = (id, repairStatus) => {
    const newRepairStatus = { ...data[id], repairStatus }; // Modify the data as needed

    const currentDate = new Date();
    const currentDateTimeString = currentDate.toLocaleString();
    const newRepairCompletionDate = {
      ...data[id],
      repairCompletionDate: currentDateTimeString,
    };
    const removeRepairCompletionDate = {
      ...data[id],
      repairCompletionDate: " N/A ",
    };

    const database = getDatabase();
    const potholeRef = ref(database, `pothole/${id}`);
    update(potholeRef, newRepairStatus)
      .then(() => {
        if (repairStatus === "Completed") {
          update(potholeRef, newRepairCompletionDate);
          alert("Data updated successfully");
        } else if (repairStatus !== "Completed") {
          update(potholeRef, removeRepairCompletionDate);
          alert("Data updated successfully");
        }
      })
      .catch((error) => {
        alert("Error updating data:", error);
      });
  };

  const handleRepairStatusChange = (id, event) => {
    const selectedStatus = event.target.value;
    const newData = { ...data };
    newData[id].repairStatus = selectedStatus;
    setData(newData);
    updateData(id, selectedStatus);
  };

  const sortData = (field) => {
    let direction = "asc";

    if (sortConfig.field === field && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ field, direction });

    const sortedData = Object.keys(data).sort((a, b) => {
      if (data[a][field] < data[b][field]) {
        return direction === "asc" ? -1 : 1;
      }
      if (data[a][field] > data[b][field]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    const sortedDataObj = {};
    sortedData.forEach((key) => {
      sortedDataObj[key] = data[key];
    });

    setData(sortedDataObj);
  };


  return (

    /* (remove when done)

        1. Redesign to be consistent with frontend
        2. Sorting function (done)
        3. report function (CSV)

    */

    <div>
      <table>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "center",
                paddingRight: "30px",
                paddingLeft: "30px",
              }}
            >
              No
            </th>
            <th
              style={{
                textAlign: "center",
                paddingRight: "40px",
                paddingLeft: "40px",
              }}
            >
              Image
            </th>
            <th
              style={{
                textAlign: "center",
                paddingRight: "40px",
                paddingLeft: "40px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Location</span>
                <div>
                  <button
                    onClick={() => sortData("location")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 2l4 4H4L8 2z" />
                      <path d="M8 14l-4-4h8l-4 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </th>
            <th
              style={{
                textAlign: "center",
                paddingRight: "40px",
                paddingLeft: "40px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Report Date</span>
                <div>
                  <button
                    onClick={() => sortData("reportDate")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 2l4 4H4L8 2z" />
                      <path d="M8 14l-4-4h8l-4 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </th>
            <th
              style={{
                textAlign: "center",
                paddingRight: "40px",
                paddingLeft: "40px",
              }}
            >
              Confidential Level
            </th>
            <th
              style={{
                textAlign: "center",
                paddingRight: "40px",
                paddingLeft: "40px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Repair Status</span>
                <div>
                  <button
                    onClick={() => sortData("repairStatus")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 2l4 4H4L8 2z" />
                      <path d="M8 14l-4-4h8l-4 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((id, index) => {
            const imageUrl = data[id].Url;

            return (
              <tr key={id}>
                <td scope="row" style={{ textAlign: "center" }}>
                  {index + 1}
                </td>
                <td style={{ textAlign: "center" }}>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Pothole"
                      width="150"
                      height="100"
                    />
                  )}
                </td>
                <td style={{ textAlign: "center" }}>{data[id].location}</td>
                <td style={{ textAlign: "center" }}>{data[id].reportDate}</td>
                <td style={{ textAlign: "center" }}>
                  {data[id].confidentialLevel}
                </td>
                <td style={{ textAlign: "center" }}>
                  <select
                    value={data[id].repairStatus}
                    onChange={(event) => handleRepairStatusChange(id, event)}
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Awaiting Approval">Awaiting Approval</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
