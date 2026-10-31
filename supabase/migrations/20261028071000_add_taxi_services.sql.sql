/*
# Add taxi services to all 26 cities

1. Purpose
- Add a "taxi" category venue for each city so visitors can find local taxi/transfer services.

2. Tables
- Inserts into `venues` (category = 'taxi') with name, description, rating,
  price_from_eur, image_url, address, source, featured, city_id.
- One taxi service per city (26 total).

3. Security
- No schema changes. Existing RLS policies and grants on `venues` cover these rows.
*/

INSERT INTO venues (city_id, name, category, description, rating, price_from_eur, image_url, address, source, featured) VALUES
('36ef206c-3c82-4428-9593-9295cb5effbb', 'Zagreb Taxi Radio', 'taxi', '24/7 city taxi dispatch with airport transfers and English-speaking drivers.', 4.4, 8.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Ilica 17, Zagreb', 'TripAdvisor', true),
('02f2541a-2f55-4610-a9ac-bce1934beb64', 'Dubrovnik Taxi Service', 'taxi', 'Reliable transfers from Dubrovnik airport and the old town, with sea-view routes.', 4.5, 10.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Pile Gate, Dubrovnik', 'TripAdvisor', true),
('31af5668-9d9e-4855-9b99-985dd8b57646', 'Split Taxi Transfer', 'taxi', 'Airport and ferry-port transfers, plus city rides with fixed meter rates.', 4.3, 8.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Obala kneza Domagoja 5, Split', 'TripAdvisor', false),
('5e869cc8-fdaf-492f-aabc-916ebd3c8987', 'Zadar Radio Taxi', 'taxi', 'City taxis and airport transfers with knowledgeable local drivers.', 4.2, 7.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Poljana Zoran Đinđić 1, Zadar', 'TripAdvisor', false),
('f7c87f85-3170-4cfd-870d-51eef85f5cc1', 'Rovinj Taxi & Transfers', 'taxi', 'Transfers to Pula airport and along the Istrian coast.', 4.4, 9.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Trg Maršala Tita 1, Rovinj', 'TripAdvisor', false),
('a250114d-64dd-4926-bc19-0e28e54b5bdf', 'Pula Taxi Co', 'taxi', 'Airport and amphitheatre-area transfers with English-speaking drivers.', 4.1, 7.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Giardini 1, Pula', 'TripAdvisor', false),
('91072ca6-165c-4b52-affc-0d54cf20051f', 'Osijek Taxi', 'taxi', 'City rides and station transfers in the Slavonian capital.', 4.0, 5.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Trg Ante Starčevića 1, Osijek', 'TripAdvisor', false),
('196c061a-c1bc-4b28-9e05-815d85d8ecc2', 'Šibenik Taxi', 'taxi', 'Local taxis and transfers to Krka National Park and the coast.', 4.2, 7.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Poljana Republike Hrvatske 2, Šibenik', 'TripAdvisor', false),
('2b363232-0e8e-44f1-95ec-640192d3a928', 'Poreč Taxi', 'taxi', 'Coastal transfers and airport runs along western Istria.', 4.1, 8.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Trg Slobode 1, Poreč', 'TripAdvisor', false),
('58e15ce3-5245-44ac-816a-b83372e0f16b', 'Makarska Taxi', 'taxi', 'Riviera taxis and transfers to Split airport and Biokovo.', 4.0, 6.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Riva 1, Makarska', 'TripAdvisor', false),
('0039b0d7-89ea-41d6-b330-771f0da47d25', 'Hvar Taxi & Boat Transfers', 'taxi', 'Island taxis plus harbour-to-hotel transfers.', 4.3, 9.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Riva 1, Hvar', 'TripAdvisor', false),
('cca1e277-a120-4dc9-a841-4cc4ff8b95a9', 'Korčula Taxi', 'taxi', 'Old-town taxis and island transfers to vineyards and beaches.', 4.1, 8.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Obala 1, Korčula', 'TripAdvisor', false),
('73886cf5-de8f-4ede-bd2f-74ec440cbd53', 'Trogir Taxi', 'taxi', 'Airport transfers and UNESCO old-town pick-ups.', 4.2, 7.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Trg Ivana Pavla II 1, Trogir', 'TripAdvisor', false),
('ab0ab3f3-5c31-4861-ae93-b1532a2fb4cd', 'Opatija Taxi', 'taxi', 'Riviera transfers and rides along the Lungomare.', 4.2, 7.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Maršala Tita 1, Opatija', 'TripAdvisor', false),
('99dd1cf7-e800-4839-bd1a-7ce01fe0ea5a', 'Varaždin Taxi', 'taxi', 'Baroque city rides and airport runs to Zagreb.', 4.1, 5.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Trg kralja Tomislava 1, Varaždin', 'TripAdvisor', false),
('a45004d2-0358-4f10-858a-3bb00133fd61', 'Rijeka Taxi', 'taxi', 'Port-city taxis and transfers along the Kvarner Gulf.', 4.0, 6.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Korzo 1, Rijeka', 'TripAdvisor', false),
('128879ee-67f6-4247-9ad9-e1bfd2ca8c28', 'Cavtat Taxi', 'taxi', 'Airport transfers to Dubrovnik and coastal rides to the peninsula.', 4.3, 9.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Tiha 1, Cavtat', 'TripAdvisor', false),
('8bb9dd4b-eb22-4468-9946-6acec6391828', 'Brač Taxi', 'taxi', 'Island transfers between Supetar, Bol, and the ferry port.', 4.1, 7.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Supetar Harbour, Brač', 'TripAdvisor', false),
('33485385-9ba6-418c-8595-b8adee0549a7', 'Krk Taxi', 'taxi', 'Island taxis and transfers to Rijeka airport.', 4.0, 6.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Krk Town Square, Krk', 'TripAdvisor', false),
('32799d67-d4de-49b8-99f4-f43d6fd517af', 'Lošinj Taxi', 'taxi', 'Wellness-island transfers and harbour pick-ups.', 4.2, 7.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Mali Lošinj Harbour, Lošinj', 'TripAdvisor', false),
('aad21d56-294a-4fbe-bf74-f291908eed3a', 'Rab Taxi', 'taxi', 'Old-town taxis and transfers around the island.', 4.0, 6.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Trg Sv. Kristofora 1, Rab', 'TripAdvisor', false),
('99aad3ec-3c1e-4cc6-9f85-ab92963e3f99', 'Mljet Taxi & Transfers', 'taxi', 'National Park transfers and island village pick-ups.', 4.1, 7.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Pomena Harbour, Mljet', 'TripAdvisor', false),
('d23a8111-0b33-4dcd-b7c7-547f3fa7db64', 'Motovun Taxi', 'taxi', 'Hilltop village transfers and Istrian wine-country rides.', 4.2, 8.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Grad Motovun 1, Motovun', 'TripAdvisor', false),
('53c4e25d-c9df-4979-a033-43f79a631ddc', 'Pag Taxi', 'taxi', 'Island transfers between Novalja, Pag town, and the ferry.', 4.0, 6.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Pag Town Square, Pag', 'TripAdvisor', false),
('d84a05e2-ac8f-44c7-aa8c-71764d8ac662', 'Vis Taxi', 'taxi', 'Remote-island transfers to hidden coves and the ferry port.', 4.1, 7.00, 'https://images.pexels.com/photos/3617388/pexels-photo-3617388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vis Town Harbour, Vis', 'TripAdvisor', false),
('66c7456f-d6fa-42cb-bbcd-11b1e1785234', 'Ston Taxi', 'taxi', 'Transfers along the Pelješac peninsula and to Dubrovnik.', 4.2, 8.00, 'https://images.pexels.com/photos/5834939/pexels-photo-5834939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Ston Main Gate, Ston', 'TripAdvisor', false);
