document.addEventListener('DOMContentLoaded', () => {
    // Fetch room data
    fetch('rooms.json')
        .then(response => response.json())
        .then(rooms => {
            // Show splash screen for 3 seconds, then load home page
            setTimeout(() => {
                document.getElementById('splash-screen').style.display = 'none';
                document.getElementById('main-content').classList.remove('hidden');
                loadHomePage(rooms);
            }, 3000);

            // Load home page with room cards
            function loadHomePage(rooms) {
                const roomGrid = document.getElementById('room-grid');
                roomGrid.innerHTML = '';
                rooms.forEach(room => {
                    const card = document.createElement('div');
                    card.className = 'room-card bg-white p-4 rounded-lg shadow-md slide-up';
                    card.tabIndex = 0;
                    card.setAttribute('role', 'button');
                    card.setAttribute('aria-label', room.title);
                    card.innerHTML = `
                        <img src="${room.thumbnail}" alt="${room.title}" class="w-full h-48 object-cover rounded-md mb-4" loading="lazy">
                        <h3 class="text-xl font-semibold">${room.title}</h3>
                        <p class="text-gray-600">${room.description}</p>
                    `;
                    card.addEventListener('click', () => loadRoomDetail(room.id, rooms));
                    card.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            loadRoomDetail(room.id, rooms);
                        }
                    });
                    roomGrid.appendChild(card);
                });
                document.getElementById('home-page').classList.remove('hidden');
                document.getElementById('room-detail').classList.add('hidden');
            }

            // Load room detail page
            function loadRoomDetail(roomId, rooms) {
                const room = rooms.find(r => r.id === roomId);
                if (!room) return;

                document.getElementById('room-title').textContent = room.title;
                document.getElementById('room-description').textContent = room.fullDescription;
                const imagesContainer = document.getElementById('room-images');
                imagesContainer.innerHTML = '';
                room.images.forEach(image => {
                    const img = document.createElement('img');
                    img.src = image;
                    img.alt = room.title;
                    img.className = 'w-full h-auto rounded-md';
                    img.loading = 'lazy';
                    img.onerror = () => { img.style.display = 'none'; };
                    imagesContainer.appendChild(img);
                });

                document.getElementById('home-page').classList.add('hidden');
                document.getElementById('room-detail').classList.remove('hidden');
            }

            // Back link functionality
            document.getElementById('back-link').addEventListener('click', (e) => {
                e.preventDefault();
                loadHomePage(rooms);
            });
        })
        .catch(error => {
            document.getElementById('splash-screen').innerHTML = '<h2 class="text-white">Failed to load exhibits.</h2>';
            console.error('Error loading rooms:', error);
        });
});