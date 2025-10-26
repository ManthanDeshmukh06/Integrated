"use client";
import React, { useState } from 'react';
import AppointmentDetailModal from './AppointmentDetailModal';

// Modal to display the Zoom link and passcode (kept within this component for encapsulation)
function MeetingLinkModal({ consultation, onClose }) {
    const [copied, setCopied] = useState(null);

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Meeting Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="bi bi-x-lg"></i></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Meeting URL</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input type="text" readOnly value={consultation.joinUrl} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"/>
                            <button onClick={() => handleCopy(consultation.joinUrl, 'URL')} className="p-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">
                                <i className="bi bi-clipboard"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Passcode</label>
                         <div className="flex items-center gap-2 mt-1">
                            <input type="text" readOnly value={consultation.passcode} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"/>
                             <button onClick={() => handleCopy(consultation.passcode, 'Passcode')} className="p-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">
                                <i className="bi bi-clipboard"></i>
                            </button>
                        </div>
                    </div>
                    {copied && <p className="text-sm text-green-600 text-center pt-2">Copied {copied} to clipboard!</p>}
                </div>
                 <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm">Close</button>
                </div>
            </div>
        </div>
    );
}


export default function VirtualConsultation({ appointments }) {
  const [linkModalData, setLinkModalData] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Scheduled Virtual Consultations</h2>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div key={app.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
                        <i className="bi bi-camera-video text-xl"></i>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{app.patientName}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                            {app.type} Consultation
                        </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{app.time}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(app.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-1 items-center gap-2">
          <button
            onClick={() => window.open(app.joinUrl, '_blank')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <i className="bi bi-camera-video"></i>
            Join Now
          </button>
          <button
            onClick={() => setLinkModalData(app)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Meeting URL
          </button>
          </div>
          <div className="flex justify-end items-end flex-1">
          <button
            onClick={() => setSelectedAppointment(app)}
            className="px-4 py-2 border border-blue-400 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            <i className="bi bi-eye"></i>
            View Details
          </button>
          </div>
        </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="bi bi-camera-video-off text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-500">No Scheduled Virtual Consultations</h3>
            <p className="text-gray-400 mt-1">Upcoming video consultations will appear here.</p>
          </div>
        )}
      </div>

      {linkModalData && <MeetingLinkModal consultation={linkModalData} onClose={() => setLinkModalData(null)} />}
      {selectedAppointment && (
        <AppointmentDetailModal appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
      )}
    </>
  );
}