$(document).ready(function () {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    function renderAppointments(appointments) {
        const tbody = $('#appointmentsTable tbody');
        tbody.empty();
        
        appointments.forEach(appointment => {
            const row = `<tr>
                <td>${appointment.id}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.doctorName}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
            </tr>`;
            tbody.append(row);
        });
    }
    
    $('#searchInput').on('input', function () {
        const searchTerm = $(this).val().toLowerCase();
        const filteredAppointments = appointments.filter(appointment => 
            appointment.patientName.toLowerCase().includes(searchTerm) ||
            appointment.doctorName.toLowerCase().includes(searchTerm) ||
            appointment.id.toString().includes(searchTerm)
        );
        renderAppointments(filteredAppointments);
    });
    
    renderAppointments(appointments);
});
