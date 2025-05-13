import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../lib/database.types'

interface AddVenueFormProps {
  onClose: () => void
  onVenueAdded: () => void
}

const initialForm = {
  name: '',
  address: '',
  city: '',
  state: '',
  pin_code: '',
  capacity: '',
  description: '',
  contact_person: '',
  contact_phone: '',
  contact_email: '',
  price_per_day: '',
  available_from: '',
  available_until: '',
}

function AddVenueForm({ onClose, onVenueAdded }: AddVenueFormProps) {
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    // Basic validation
    if (!form.name || !form.address || !form.city || !form.state || !form.pin_code || !form.capacity || !form.description || !form.contact_person || !form.contact_phone || !form.contact_email || !form.price_per_day || !form.available_from || !form.available_until) {
      setError('Please fill all fields')
      setIsSubmitting(false)
      return
    }
    const { error } = await supabase.from('venues').insert({
      name: form.name,
      address: form.address,
      city: form.city,
      state: form.state,
      pin_code: form.pin_code,
      capacity: parseInt(form.capacity),
      description: form.description,
      contact_person: form.contact_person,
      contact_phone: form.contact_phone,
      contact_email: form.contact_email,
      price_per_day: parseFloat(form.price_per_day),
      available_from: form.available_from,
      available_until: form.available_until,
      amenities: [],
      images: [],
    })
    if (error) setError(error.message)
    else {
      onVenueAdded()
      onClose()
    }
    setIsSubmitting(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
      <h2 className="text-xl font-bold mb-4">Add Venue</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Venue Name" className="w-full border rounded px-3 py-2" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border rounded px-3 py-2" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full border rounded px-3 py-2" />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="w-full border rounded px-3 py-2" />
        <input name="pin_code" value={form.pin_code} onChange={handleChange} placeholder="Pin Code" className="w-full border rounded px-3 py-2" />
        <input name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacity" type="number" className="w-full border rounded px-3 py-2" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border rounded px-3 py-2" />
        <input name="contact_person" value={form.contact_person} onChange={handleChange} placeholder="Contact Person" className="w-full border rounded px-3 py-2" />
        <input name="contact_phone" value={form.contact_phone} onChange={handleChange} placeholder="Contact Phone" className="w-full border rounded px-3 py-2" />
        <input name="contact_email" value={form.contact_email} onChange={handleChange} placeholder="Contact Email" className="w-full border rounded px-3 py-2" />
        <input name="price_per_day" value={form.price_per_day} onChange={handleChange} placeholder="Price Per Day" type="number" className="w-full border rounded px-3 py-2" />
        <input name="available_from" value={form.available_from} onChange={handleChange} placeholder="Available From (YYYY-MM-DD)" type="date" className="w-full border rounded px-3 py-2" />
        <input name="available_until" value={form.available_until} onChange={handleChange} placeholder="Available Until (YYYY-MM-DD)" type="date" className="w-full border rounded px-3 py-2" />
        <div className="flex justify-end space-x-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-blue-600 text-white">{isSubmitting ? 'Adding...' : 'Add Venue'}</button>
        </div>
      </form>
    </div>
  )
}

export default AddVenueForm 