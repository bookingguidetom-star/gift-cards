/*
# Add 10 hotels to Zagreb

Zagreb currently has 3 hotels. Adding 10 more to reach 13 total.
Avoids existing names: Hotel Esplanade Zagreb, Sheraton Zagreb Hotel, The Westin Zagreb.
*/

INSERT INTO venues (city_id, name, category, description, rating, price_from_eur, image_url, address, source, featured) VALUES
('36ef206c-3c82-4428-9593-9295cb5effbb', 'Le Premier Boutique Hotel', 'hotel', 'Boutique five-star near the train station with marble bathrooms and a spa.', 4.7, 180.00, 'https://images.pexels.com/photos/39459699/pexels-photo-39459699.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Klaftićeva 6, Zagreb', 'Booking.com', false),
('36ef206c-3c82-4428-9593-9295cb5effbb', 'Canopy by Hilton Zagreb', 'hotel', 'Modern lifestyle hotel in the business district with rooftop bar.', 4.5, 150.00, 'https://images.pexels.com/photos/39814600/pexels-photo-39814600.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vukovarska 263A, Zagreb', 'TripAdvisor', false),
('36ef206c-3c82-4428-9593-9295cb5effbb', 'Hotel Antunović', 'hotel', 'Spacious suites and a wellness centre in Novi Zagreb.', 4.3, 110.00, 'https://images.pexels.com/photos/18649226/pexels-photo-18649226.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Zaprešićka 107, Zagreb', 'Booking.com', false),
('36ef206c-3c82-4428-9593-9295cb5effbb', 'Best Western Premier Astoria', 'hotel', 'Refined hotel near the main square with a jazz piano bar.', 4.4, 130.00, 'https://images.pexels.com/photos/9119625/pexels-photo-9119625.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Petrinjska 71, Zagreb', 'Best Western', false),
('36ef206c-3c82-4428-9593-9295cb5effbb', 'Hotel Jägerhorn', 'hotel', 'Oldest hotel in Zagreb (1827) with a cozy pub and garden terrace.', 4.3, 120.00, 'https://images.pexels.com/photos/2771935/pexels-photo-2771935.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Ilica 14, Zagreb', 'TripAdvisor', false),
('36ef206c-3c82-4428-9593-9295cb5effbb', 'DoubleTree by Hilton Zagreb', 'hotel', 'Contemporary hotel near the arena with welcome cookies and a spa.', 4.4, 130.00, 'https://images.pexels.com/photos/3011575/pexels-photo-3011575.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Sarajevska cesta 41, Zagreb', 'Hilton', false),
('36ef206c-3c82-4428-9593-9295cb5effbb', 'Hotel Aristos', 'hotel', 'Modern four-star in Novi Zagreb with a wellness centre.', 4.2, 95.00, 'https://images.pexels.com/photos/24807130/pexels-photo-24807130.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Sarajevska 29, Zagreb', 'Booking.com', false),
('36ef206c-3c82-4428-9593-9295cb5effbb', 'Hotel Maksimir', 'hotel', 'Quiet hotel near Maksimir park with garden terrace and restaurant.', 4.1, 90.00, 'https://images.pexels.com/photos/30791068/pexels-photo-30791068.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Maksimirska 92, Zagreb', 'TripAdvisor', false),
('36ef206c-3c82-4428-9593-9295cb5effbb', 'Hotel Dubrovnik Zagreb', 'hotel', 'Central hotel on the main square with rooftop restaurant and bar.', 4.3, 140.00, 'https://images.pexels.com/photos/40156183/pexels-photo-40156183.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Gajeva 1, Zagreb', 'Booking.com', false),
('36ef206c-3c82-4428-9593-9295cb5effbb', 'Hotel As Zagreb', 'hotel', 'Design-led hotel near the botanical garden with spa and lounge.', 4.2, 115.00, 'https://images.pexels.com/photos/2611010/pexels-photo-2611010.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Preradovićeva 43, Zagreb', 'TripAdvisor', false);
