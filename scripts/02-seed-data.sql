-- Insert sample data for testing

-- Insert Admin User
INSERT INTO Users (FullName, Email, Phone, PasswordHash, Role, Address) VALUES
('Admin User', 'admin@pharmacy.com', '+1234567890', '$2b$10$example_hash', 'Admin', '123 Admin St, City, State');

-- Insert Pharmacy Users
INSERT INTO Users (FullName, Email, Phone, PasswordHash, Role, Address) VALUES
('MediCare Pharmacy', 'medicare@pharmacy.com', '+1234567891', '$2b$10$example_hash', 'Pharmacy', '456 Health Ave, City, State'),
('QuickMeds Pharmacy', 'quickmeds@pharmacy.com', '+1234567892', '$2b$10$example_hash', 'Pharmacy', '789 Medicine Blvd, City, State');

-- Insert Customer Users
INSERT INTO Users (FullName, Email, Phone, PasswordHash, Role, Address) VALUES
('John Doe', 'john@example.com', '+1234567893', '$2b$10$example_hash', 'Customer', '321 Customer Lane, City, State'),
('Jane Smith', 'jane@example.com', '+1234567894', '$2b$10$example_hash', 'Customer', '654 Patient Road, City, State');

-- Insert Sample Products
INSERT INTO Products (PharmacyID, Name, Description, Price, RequiresPrescription, Stock) VALUES
(2, 'Paracetamol 500mg', 'Pain relief and fever reducer', 5.99, 0, 100),
(2, 'Ibuprofen 400mg', 'Anti-inflammatory pain reliever', 7.50, 0, 75),
(2, 'Amoxicillin 250mg', 'Antibiotic for bacterial infections', 12.99, 1, 50),
(3, 'Aspirin 100mg', 'Blood thinner and pain relief', 4.99, 0, 200),
(3, 'Omeprazole 20mg', 'Acid reflux medication', 15.99, 1, 30);

-- Insert Sample Product Images
INSERT INTO ProductImages (ProductID, ImageUrl, IsPrimary) VALUES
(1, '/images/paracetamol.jpg', 1),
(2, '/images/ibuprofen.jpg', 1),
(3, '/images/amoxicillin.jpg', 1),
(4, '/images/aspirin.jpg', 1),
(5, '/images/omeprazole.jpg', 1);
