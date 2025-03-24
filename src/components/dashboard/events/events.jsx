import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./events.css";
import eventStore from '../../../store/eventStore';
import Popup from '../../popup/popup';

const EventsPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    content: "",
    startDate: null,
    endDate: null,
  });
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    status: "",
  });

  const { events, addEvent, fetchEvents, deleteEvent } = eventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (popup.show) {
      const timeout = setTimeout(() => {
        setPopup(prevPopup => ({ ...prevPopup, show: false }));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [popup.show]);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const { image } = formData;

    if (!image) {
      setPopup({
        show: true,
        title: "Error",
        message: "Please select an image for the event!",
        status: "error",
      });
      return;
    }

    const fileName = image.name;
    const hasSpaces = /\s/.test(fileName);
    
    if (hasSpaces) {
      setPopup({
        show: true,
        title: "Error",
        message: "Image file name must not contain any spaces!",
        status: "error",
      });
      return;
    }

    try {
      const result = await addEvent(formData, image);
      
      if (!result) {
        throw new Error("No response received from server");
      }

      setPopup({
        show: true,
        title: result.Title || result.title || "Success",
        message: result.Message || result.message || "Event added successfully",
        status: result.Status || result.status || "success",
      });

      if ((result.Status || result.status) === "success") {
        setFormData({
          title: "",
          image: null,
          content: "",
          startDate: null,
          endDate: null,
        });
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setPopup({
        show: true,
        title: "Error",
        message: error.message || "Failed to add event",
        status: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: file,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: date,
    }));
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const result = await deleteEvent(eventId);
      setPopup({
        show: true,
        title: result.Title || result.title || "Success",
        message: result.Message || result.message || "Event deleted successfully",
        status: result.Status || result.status || "success",
      });
    } catch (error) {
      setPopup({
        show: true,
        title: "Error",
        message: error.message || "Failed to delete event",
        status: "error",
      });
    }
  }; 

  return (
    <div className="events-page">
      <h1>Create Event</h1>

      <form onSubmit={handleAddEvent} className="event-form" noValidate>
        <div className="form-group">
          <label htmlFor="title">Event Name:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., SummerCamping2023"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Event Image (required):</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
          />
          <div className="requirements-hint">
            <p><strong>Requirements:</strong></p>
            <ul>
              <li>Image is required</li>
              <li>File name must not contain spaces</li>
              <li>Example valid names: "Event#1.jpg", "Party-2023.png"</li>
            </ul>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <DatePicker
            selected={formData.startDate}
            onChange={(date) => handleDateChange(date, 'startDate')}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select start date and time"
            className="date-picker-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <DatePicker
            selected={formData.endDate}
            onChange={(date) => handleDateChange(date, 'endDate')}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select end date and time"
            className="date-picker-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Event Details:</label>
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Describe your event details here..."
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Event
        </button>
      </form>

      {popup.show && (
        <Popup
          title={popup.title}
          message={popup.message}
          status={popup.status}
        />
      )}

      <div className="events-list">
        <h2>Event List</h2>
        {events.length === 0 ? (
          <p>No events added yet.</p>
        ) : (
          events.map((event) => (
            <div key={event.eventId} className="event-card">
              {event.eventImageLink && (
                <img 
                  src={event.eventImageLink} 
                  alt={event.eventName} 
                  className="event-image" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/default-event-image.jpg';
                  }}
                />
              )}
              <h3 className="event-title">{event.eventName}</h3>
              <div
                className="event-content"
                dangerouslySetInnerHTML={{ __html: event.eventContent }}
              />
              <p><strong>Start:</strong> {new Date(event.eventPeriod.startFrom.seconds * 1000).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(event.eventPeriod.endAt.seconds * 1000).toLocaleString()}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteEvent(event.eventId)}
              >
                Delete Event
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPage;