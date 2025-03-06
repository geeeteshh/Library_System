import React, { useState } from "react";
import { Input } from "../components/input";

const CheckIn = () => {
  const [bookId, setBookId] = useState("");
  const [patronData, setPatronData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setBookId(value);
    }
  };

  const handleCheckIn = () => {
    // Simulated data for 15 patrons
    const patrons = Array.from({ length: 15 }, (_, index) => ({
      patronName: `Patron ${index + 1}`,
      patronId: `${1000 + index}`,
      dateOfIssue: `2023-01-${String(index + 1).padStart(2, "0")}`,
      dateOfResubmission: `2023-01-${String(index + 15).padStart(2, "0")}`,
      numberOfDays: 14 + index,
      bookId: bookId || `B00${index + 1}`,
      bookTitle: `Book Title ${index + 1}`,
      bookCategory: `Category ${
        index % 3 === 0
          ? "Programming"
          : index % 3 === 1
          ? "Fiction"
          : "Science"
      }`,
      fineAmount: 50 + index * 10,
    }));
    setPatronData(patrons); // Set array of patrons
  };

  const handleReissue = (index) => {
    const newPatron = {
      ...patronData[index],
      dateOfIssue: new Date().toISOString().split("T")[0],
      dateOfResubmission: "",
      numberOfDays: "",
      fineAmount: "",
    };
    setPatronData([...patronData, newPatron]);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData(patronData[index]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditSubmit = () => {
    const updatedPatrons = patronData.map((patron, index) =>
      index === editIndex ? editData : patron
    );
    setPatronData(updatedPatrons);
    setEditIndex(null);
    setEditData({});
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-black">Check In</h2>
      <p className="text-gray-800">
        This is the Check-In page. Use this section to check in returned books.
      </p>
      <div className="mb-4 flex items-center space-x-4">
        <label htmlFor="bookId" className="text-gray-700">
          Enter Book ID:
        </label>
        <Input
          type="text"
          id="bookId"
          value={bookId}
          onChange={handleInputChange}
          className="text-blue-600 w-1/3"
        />
        <button
          onClick={handleCheckIn}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Search
        </button>
      </div>
      {patronData.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-800">Book ID: {patronData[0].bookId}</p>
          <p className="text-gray-800">Book Title: {patronData[0].bookTitle}</p>
          <p className="text-gray-800">
            Book Category: {patronData[0].bookCategory}
          </p>
        </div>
      )}
      {patronData.length > 0 && (
        <table className="min-w-full bg-aliceblue">
          <thead>
            <tr className="bg-blue-200">
              <th className="py-2 text-blue-800">Patron Name</th>
              <th className="py-2 text-blue-800">Patron ID</th>
              <th className="py-2 text-blue-800">Date of Issue</th>
              <th className="py-2 text-blue-800">Date of Submission</th>
              <th className="py-2 text-blue-800">Number of Days</th>
              <th className="py-2 text-blue-800">Fine (in Rupees)</th>
              <th className="py-2 text-blue-800">Reissue</th>
              <th className="py-2 text-blue-800">Edit</th>
            </tr>
          </thead>
          <tbody>
            {patronData.map((patron, index) => (
              <tr key={index} className="bg-white">
                <td className="border px-4 py-2 text-blue-600">
                  {patron.patronName}
                </td>
                <td className="border px-4 py-2 text-blue-600">
                  {patron.patronId}
                </td>
                <td className="border px-4 py-2 text-blue-600">
                  {patron.dateOfIssue}
                </td>
                <td className="border px-4 py-2 text-blue-600">
                  {patron.dateOfResubmission}
                </td>
                <td className="border px-4 py-2 text-blue-600">
                  {patron.numberOfDays}
                </td>
                <td className="border px-4 py-2 text-blue-600">
                  {patron.fineAmount}
                </td>
                <td className="border px-4 py-2 text-blue-600">
                  <button
                    onClick={() => handleReissue(index)}
                    className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Check In
                  </button>
                </td>
                <td className="border px-4 py-2 text-blue-600">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editIndex !== null && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Edit Patron Details</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-2">
              <label className="block text-gray-700">Patron Name:</label>
              <Input
                type="text"
                name="patronName"
                value={editData.patronName}
                onChange={handleEditChange}
                className="text-blue-600 w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Patron ID:</label>
              <Input
                type="text"
                name="patronId"
                value={editData.patronId}
                onChange={handleEditChange}
                className="text-blue-600 w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Date of Issue:</label>
              <Input
                type="date"
                name="dateOfIssue"
                value={editData.dateOfIssue}
                onChange={handleEditChange}
                className="text-blue-600 w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Date of Submission:</label>
              <Input
                type="date"
                name="dateOfResubmission"
                value={editData.dateOfResubmission}
                onChange={handleEditChange}
                className="text-blue-600 w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Number of Days:</label>
              <Input
                type="number"
                name="numberOfDays"
                value={editData.numberOfDays}
                onChange={handleEditChange}
                className="text-blue-600 w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Fine (in Rupees):</label>
              <Input
                type="number"
                name="fineAmount"
                value={editData.fineAmount}
                onChange={handleEditChange}
                className="text-blue-600 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckIn;