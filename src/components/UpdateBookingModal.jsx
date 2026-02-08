"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function UpdateBookingModal({ booking, onClose, onUpdate }) {
  const [checkIn, setCheckIn] = useState(new Date(booking.checkInDate));
  const [checkOut, setCheckOut] = useState(new Date(booking.checkOutDate));
  const [guests, setGuests] = useState(booking.guests);

  const handleSubmit = () => {
    onUpdate(booking._id, {
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
      guests,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Booking</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div>
            <Label>Check-In Date</Label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div>
            <Label>Check-Out Date</Label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div>
            <Label>Guests</Label>
            <Input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
