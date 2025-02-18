import React from "react";

const AddPatron = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-bold mb-4 text-black">Add Patron</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Patron Name"
          className="w-full border border-gray-300 p-2 rounded-lg"
        />
        <input
          type="email"
          placeholder="Patron Email"
          className="w-full border border-gray-300 p-2 rounded-lg"
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPatron;
