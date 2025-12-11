'use client';

import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { updateContact, deleteContact } from '@/lib/contacts';
import { EmergencyContact } from '@/types';

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: EmergencyContact | null;
  onContactUpdated: () => void;
  onContactDeleted: () => void;
}

export default function EditContactModal({ 
  isOpen, 
  onClose, 
  contact, 
  onContactUpdated,
  onContactDeleted 
}: EditContactModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
      setRelationship(contact.relationship || '');
      setIsPrimary(contact.isPrimary);
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    setLoading(true);
    setError(null);

    try {
      await updateContact(contact.id, {
        name,
        phone,
        relationship: relationship || undefined,
        isPrimary,
      });
      
      onContactUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!contact) return;

    setLoading(true);
    setError(null);

    try {
      await deleteContact(contact.id);
      onContactDeleted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete contact');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen || !contact) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Edit Emergency Contact</h2>
        <p className="text-sm text-gray-600 mt-1">Update contact information</p>
      </div>

      {!showDeleteConfirm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              id="edit-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label htmlFor="edit-relationship" className="block text-sm font-medium text-gray-700 mb-1">
              Relationship (optional)
            </label>
            <input
              id="edit-relationship"
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Family, Friend, Colleague..."
            />
          </div>

          <div className="flex items-center">
            <input
              id="edit-isPrimary"
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="edit-isPrimary" className="ml-2 text-sm text-gray-700">
              Set as primary contact
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              variant="danger"
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Contact?</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete {contact.name}? This action cannot be undone.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              variant="danger"
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Delete Contact'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

