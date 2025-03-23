-- Sample data for Paluan Tour Database

-- Insert Addresses
INSERT INTO `Addresses` (id, barangay, street, region, province, municipality, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Seaside Street', 4, 17, 1751, NOW(), NOW()),
(2, 2, 'Mountain View Road', 4, 17, 1751, NOW(), NOW()),
(3, 3, 'Central Avenue', 4, 17, 1751, NOW(), NOW()),
(4, 4, 'Beach Front', 4, 17, 1751, NOW(), NOW()),
(5, 5, 'Rural Route 1', 4, 17, 1751, NOW(), NOW());

-- Insert Users (including resort owners and regular users)
INSERT INTO `Users` (id, name, username, password, email, `userType`, phone, address, `createdAt`, `updatedAt`) VALUES
(1, 'John Resort Owner', 'john_owner', '$2a$10$xxxxxxxxxxx', 'john@resort.com', 'resortOwner', '+639123456789', 1, NOW(), NOW()),
(2, 'Mary Manager', 'mary_manager', '$2a$10$xxxxxxxxxxx', 'mary@resort.com', 'resortOwner', '+639123456790', 2, NOW(), NOW()),
(3, 'Guest User', 'guest1', '$2a$10$xxxxxxxxxxx', 'guest1@email.com', 'guest', '+639123456791', 3, NOW(), NOW()),
(4, 'Admin User', 'admin1', '$2a$10$xxxxxxxxxxx', 'admin@paluan.com', 'admin', '+639123456792', 4, NOW(), NOW());

-- Insert Resorts
INSERT INTO `Resorts` (id, name, thumbnail, rate, `permitNo`, description, address, owner, category, `guestRatingCode`, `createdAt`, `updatedAt`) VALUES
(1, 'Paluan Beach Resort', '/images/resorts/beach1.jpg', 4.5, 'PER-2024-001', 'Beautiful beachfront resort with stunning views', 1, 1, 'beach', 'BR001', NOW(), NOW()),
(2, 'Mountain Haven Resort', '/images/resorts/mountain1.jpg', 4.3, 'PER-2024-002', 'Peaceful mountain retreat with hiking trails', 2, 1, 'mountain', 'MR001', NOW(), NOW()),
(3, 'Urban Oasis Resort', '/images/resorts/urban1.jpg', 4.7, 'PER-2024-003', 'Modern resort in the heart of the city', 3, 2, 'urban', 'UR001', NOW(), NOW()),
(4, 'Rural Escape Resort', '/images/resorts/rural1.jpg', 4.2, 'PER-2024-004', 'Tranquil countryside resort experience', 4, 2, 'rural', 'RR001', NOW(), NOW());

-- Insert Tourists
INSERT INTO `Tourists` (id, name, gender, age, `visitDate`, `resortId`, `contactNumber`, barangay, street, region, province, municipality, `createdAt`, `updatedAt`) VALUES
(1, 'Alice Smith', 'Female', 28, '2024-03-22', 1, '+639187654321', 'Barangay 1', 'Main St', 'Region 4', 'Occidental Mindoro', 'Paluan', NOW(), NOW()),
(2, 'Bob Johnson', 'Male', 35, '2024-03-23', 1, '+639187654322', 'Barangay 2', 'Side St', 'Region 4', 'Occidental Mindoro', 'Paluan', NOW(), NOW()),
(3, 'Carol White', 'Female', 42, '2024-03-24', 2, '+639187654323', 'Barangay 3', 'Hill St', 'Region 4', 'Occidental Mindoro', 'Paluan', NOW(), NOW()),
(4, 'David Brown', 'Male', 31, '2024-03-25', 3, '+639187654324', 'Barangay 4', 'City St', 'Region 4', 'Occidental Mindoro', 'Paluan', NOW(), NOW()),
(5, 'Eva Green', 'Female', 29, '2024-03-26', 4, '+639187654325', 'Barangay 5', 'Rural St', 'Region 4', 'Occidental Mindoro', 'Paluan', NOW(), NOW());

-- Insert Ratings
INSERT INTO `Ratings` (id, rating, comment, `resortId`, `createdAt`, `updatedAt`) VALUES
(1, 4.5, 'Excellent beach resort with great amenities!', 1, NOW(), NOW()),
(2, 4.0, 'Beautiful views and friendly staff', 1, NOW(), NOW()),
(3, 4.8, 'Perfect mountain getaway', 2, NOW(), NOW()),
(4, 4.7, 'Modern and clean facilities', 3, NOW(), NOW()),
(5, 4.2, 'Peaceful rural setting', 4, NOW(), NOW());

-- Insert Spot Images
INSERT INTO `SpotImages` (id, url, caption, `resortId`, `createdAt`, `updatedAt`) VALUES
(1, '/images/spots/beach_view1.jpg', 'Stunning beach sunrise view', 1, NOW(), NOW()),
(2, '/images/spots/beach_view2.jpg', 'Beach resort pool area', 1, NOW(), NOW()),
(3, '/images/spots/mountain_view1.jpg', 'Mountain peak vista', 2, NOW(), NOW()),
(4, '/images/spots/urban_view1.jpg', 'City skyline from resort', 3, NOW(), NOW()),
(5, '/images/spots/rural_view1.jpg', 'Countryside landscape', 4, NOW(), NOW()); 