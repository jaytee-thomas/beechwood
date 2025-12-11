'use client';

import { EmergencyContact } from '@/types';

interface ContactsListProps {
  contacts: EmergencyContact[];
  onAddClick?: () => void;
  onEditClick?: (contact: EmergencyContact) => void;
}

export default function ContactsList({ contacts, onAddClick, onEditClick }: ContactsListProps) {
  if (contacts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-400 text-4xl mb-3">👥</div>
        <p className="text-gray-600 font-medium mb-2">No emergency contacts</p>
        <p className="text-gray-500 text-sm mb-4">Add contacts to enable emergency alerts</p>
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            + Add First Contact
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact, index) => (
        <div
          key={contact.id}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {contact.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">{contact.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{contact.phone}</span>
                  {contact.relationship && (
                    <>
                      <span>•</span>
                      <span>{contact.relationship}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {contact.isPrimary && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  Primary
                </span>
              )}
              {onEditClick && (
                <button
                  onClick={() => onEditClick(contact)}
                  className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1"
                  title="Edit contact"
                >
                  ✏️
                </button>
              )}
              <span className="text-xs text-gray-400">#{index + 1}</span>
            </div>
          </div>
        </div>
      ))}
      
      {contacts.length < 3 && onAddClick && (
        <button
          onClick={onAddClick}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
        >
          <div className="text-gray-400 text-2xl mb-2">+</div>
          <p className="text-gray-600 text-sm font-medium">Add another emergency contact</p>
          <p className="text-gray-400 text-xs">Up to 3 contacts total</p>
        </button>
      )}
    </div>
  );
}
