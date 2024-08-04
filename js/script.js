// Sample doctor data
const doctors = [
    { id: 1, name: 'Dr. Amarnath Das', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'], days: ['Monday', 'Tuesday'] },
    { id: 2, name: 'Dr. Surmial Chatterjee', slots: ['10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00'], days: ['Wednesday', 'Thursday'] },
    { id: 3, name: 'Dr. Mudhusudhan Ray', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'], days: ['Friday', 'Saturday'] },
];

let appointments = JSON.parse(localStorage.getItem('appointments')) || [];

// Populate doctor selection dropdown and doctor information section
$(document).ready(function () {
    doctors.forEach(doctor => {
        $('#doctorSelection').append(new Option(doctor.name, doctor.id));
        
        const doctorCard = `<div class="doctor-card col-lg-3">
            <h5>${doctor.name}</h5>
            <p>Total Slots: ${doctor.slots.length}</p>
            <p>Available Slots: <span id="availableSlots${doctor.id}">${doctor.slots.length}</span></p>
            <p>Booked Slots: <span id="bookedSlots${doctor.id}">0</span></p>
            <p>Available Time Slots:</p>
            <ul id="timeSlots${doctor.id}">${generateTimeSlotList(doctor.slots)}</ul>
            <p>Available Days: ${doctor.days.join(', ')}</p>
        </div>`;
        $('#doctorsList').append(doctorCard);
    });

    updateDoctorSlots();
});

// Handle booking form submission
$('#bookingForm').submit(function (event) {
    event.preventDefault();
    
    const patientName = $('#patientName').val();
    const doctorId = $('#doctorSelection').val();
    const appointmentDate = $('#appointmentDate').val();
    const appointmentTime = $('#appointmentTime').val();
    
    const appointmentDay = new Date(appointmentDate).toLocaleString('en-US', { weekday: 'long' });
    
    if (patientName && doctorId && appointmentDate && appointmentTime) {
        const doctor = doctors.find(doc => doc.id == doctorId);
        const slotIndex = doctor.slots.indexOf(appointmentTime);
        
        if (doctor.days.includes(appointmentDay)) {
            if (slotIndex > -1) {
                // Remove slot from available slots
                doctor.slots.splice(slotIndex, 1);
                appointments.push({
                    id: appointments.length + 1,
                    patientName,
                    doctorName: doctor.name,
                    date: appointmentDate,
                    time: appointmentTime
                });

                localStorage.setItem('appointments', JSON.stringify(appointments));
                
                updateDoctorSlots();
                alert('Appointment booked successfully!');
                $('#bookingForm')[0].reset();
            } else {
                alert('Selected time slot is not available.');
            }
        } else {
            alert(`Doctor is not available on ${appointmentDay}.`);
        }
    } else {
        alert('Please fill out all fields.');
    }
});

// Handle cancel form submission
$('#cancelForm').submit(function (event) {
    event.preventDefault();
    
    const appointmentId = $('#appointmentId').val();
    const appointmentIndex = appointments.findIndex(appointment => appointment.id == appointmentId);
    
    if (appointmentIndex > -1) {
        const appointment = appointments.splice(appointmentIndex, 1)[0];
        const doctor = doctors.find(doc => doc.name == appointment.doctorName);
        
        doctor.slots.push(appointment.time);
        doctor.slots.sort();

        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        updateDoctorSlots();
        alert('Appointment canceled successfully!');
        $('#cancelForm')[0].reset();
    } else {
        alert('Invalid appointment ID.');
    }
});

// Update doctor slots display
function updateDoctorSlots() {
    doctors.forEach(doctor => {
        const bookedSlots = 7 - doctor.slots.length;
        
        $(`#availableSlots${doctor.id}`).text(doctor.slots.length);
        $(`#bookedSlots${doctor.id}`).text(bookedSlots);
        $(`#timeSlots${doctor.id}`).html(generateTimeSlotList(doctor.slots));
    });
}

// Generate time slot list
function generateTimeSlotList(slots) {
    return slots.map(slot => `<li>${slot}</li>`).join('');
}
