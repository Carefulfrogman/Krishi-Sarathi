-- Krishi Saarathi Seed Data
-- Demo data for development and testing

-- Demo Users
INSERT INTO users (id, firebase_uid, email, display_name, role, reward_points) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'firebase_demo_user_1', 'ram@example.com', 'Ram Sharma', 'farmer', 1250),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'firebase_demo_user_2', 'sita@example.com', 'Sita Devi', 'farmer', 890),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'firebase_demo_user_3', 'hari@example.com', 'Hari Prasad', 'buyer', 450),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'firebase_demo_admin', 'admin@krishisaarathi.com', 'Admin User', 'admin', 0);

-- Demo Farms
INSERT INTO farms (id, user_id, name, location, latitude, longitude, area_hectares, soil_type, irrigation_type, organic_certified, description) VALUES
('f1a1a1a1-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Green Valley Farm', 'Chitwan, Nepal', 27.5291, 84.3542, 12.5, 'Loamy', 'Drip Irrigation', TRUE, 'Organic rice and vegetable farm in the Terai region'),
('f2b2b2b2-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Himalayan Herbs', 'Kaski, Nepal', 28.2096, 83.9856, 5.0, 'Sandy Loam', 'Sprinkler', FALSE, 'Medicinal herbs and spice cultivation'),
('f3c3c3c3-3333-3333-3333-333333333333', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Sunrise Organic Farm', 'Morang, Nepal', 26.6694, 87.2846, 8.0, 'Clay Loam', 'Canal', TRUE, 'Tea and organic vegetable farm');

-- Demo Crops
INSERT INTO crops (id, farm_id, name, variety, planting_date, expected_harvest, area_hectares, health_status, status) VALUES
('c1a1a1a1-1111-1111-1111-111111111111', 'f1a1a1a1-1111-1111-1111-111111111111', 'Rice', 'Basmati', '2026-03-15', '2026-07-20', 6.0, 'good', 'growing'),
('c2b2b2b2-2222-2222-2222-222222222222', 'f1a1a1a1-1111-1111-1111-111111111111', 'Tomato', 'Cherry', '2026-04-01', '2026-08-15', 2.0, 'excellent', 'growing'),
('c3c3c3c3-3333-3333-3333-333333333333', 'f2b2b2b2-2222-2222-2222-222222222222', 'Turmeric', 'Lakadong', '2026-02-10', '2026-10-30', 3.0, 'good', 'growing'),
('c4d4d4d4-4444-4444-4444-444444444444', 'f3c3c3c3-3333-3333-3333-333333333333', 'Tea', 'Orthodox', '2025-01-15', '2026-12-31', 5.0, 'excellent', 'growing'),
('c5e5e5e5-5555-5555-5555-555555555555', 'f3c3c3c3-3333-3333-3333-333333333333', 'Cabbage', 'Green Globe', '2026-05-01', '2026-09-15', 1.5, 'fair', 'growing');

-- Demo Sustainability Scores
INSERT INTO sustainability_scores (farm_id, overall_score, water_score, soil_score, biodiversity_score, carbon_score, waste_score, assessment_date) VALUES
('f1a1a1a1-1111-1111-1111-111111111111', 82.5, 85, 78, 80, 88, 82, '2026-07-01'),
('f1a1a1a1-1111-1111-1111-111111111111', 78.0, 80, 75, 76, 85, 74, '2026-06-01'),
('f1a1a1a1-1111-1111-1111-111111111111', 74.2, 76, 72, 73, 80, 70, '2026-05-01'),
('f2b2b2b2-2222-2222-2222-222222222222', 68.0, 65, 70, 72, 64, 69, '2026-07-01'),
('f3c3c3c3-3333-3333-3333-333333333333', 91.0, 92, 88, 94, 90, 91, '2026-07-01');

-- Demo Carbon Credits
INSERT INTO carbon_credits (id, farm_id, user_id, credits_amount, credits_available, verification_status, period_start, period_end) VALUES
('cc111111-1111-1111-1111-111111111111', 'f1a1a1a1-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 45.0, 30.0, 'verified', '2026-01-01', '2026-06-30'),
('cc222222-2222-2222-2222-222222222222', 'f2b2b2b2-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 18.0, 18.0, 'verified', '2026-01-01', '2026-06-30'),
('cc333333-3333-3333-3333-333333333333', 'f3c3c3c3-3333-3333-3333-333333333333', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 62.0, 50.0, 'verified', '2026-01-01', '2026-06-30');

-- Demo Marketplace Listings
INSERT INTO marketplace_listings (seller_id, credit_id, amount, price_per_credit, min_purchase, description, status) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cc111111-1111-1111-1111-111111111111', 15.0, 25.00, 5.0, 'Verified carbon credits from organic rice farming. High-quality offsets.', 'active'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'cc333333-3333-3333-3333-333333333333', 20.0, 30.00, 10.0, 'Premium tea farm carbon credits with biodiversity co-benefits.', 'active');

-- Demo Carbon Transactions
INSERT INTO carbon_transactions (seller_id, buyer_id, credit_id, amount, price_per_credit, total_price, status) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'cc111111-1111-1111-1111-111111111111', 15.0, 22.00, 330.00, 'completed'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'cc333333-3333-3333-3333-333333333333', 12.0, 28.00, 336.00, 'completed');

-- Demo Supply Chain Events
INSERT INTO supply_chain_events (crop_id, farm_id, event_type, description, location, actor_name, qr_code, event_date) VALUES
('c1a1a1a1-1111-1111-1111-111111111111', 'f1a1a1a1-1111-1111-1111-111111111111', 'planted', 'Basmati rice planted in prepared paddy fields', 'Chitwan, Nepal', 'Ram Sharma', 'QR-RICE-001', '2026-03-15'),
('c1a1a1a1-1111-1111-1111-111111111111', 'f1a1a1a1-1111-1111-1111-111111111111', 'fertilized', 'Organic compost applied', 'Chitwan, Nepal', 'Ram Sharma', 'QR-RICE-001', '2026-04-10'),
('c1a1a1a1-1111-1111-1111-111111111111', 'f1a1a1a1-1111-1111-1111-111111111111', 'irrigated', 'Drip irrigation cycle completed', 'Chitwan, Nepal', 'Ram Sharma', 'QR-RICE-001', '2026-05-01'),
('c4d4d4d4-4444-4444-4444-444444444444', 'f3c3c3c3-3333-3333-3333-333333333333', 'harvested', 'First flush tea leaves harvested', 'Morang, Nepal', 'Sita Devi', 'QR-TEA-001', '2026-04-20'),
('c4d4d4d4-4444-4444-4444-444444444444', 'f3c3c3c3-3333-3333-3333-333333333333', 'processed', 'Orthodox tea processing completed', 'Morang, Nepal', 'Sita Devi', 'QR-TEA-001', '2026-04-25'),
('c4d4d4d4-4444-4444-4444-444444444444', 'f3c3c3c3-3333-3333-3333-333333333333', 'packaged', 'Packaged in eco-friendly containers', 'Morang, Nepal', 'Sita Devi', 'QR-TEA-001', '2026-04-28');

-- Demo Insurance Policies
INSERT INTO insurance_policies (id, user_id, farm_id, policy_number, provider, coverage_type, coverage_amount, premium, start_date, end_date, status) VALUES
('ip111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f1a1a1a1-1111-1111-1111-111111111111', 'POL-2026-001', 'Nepal Agricultural Insurance Co.', 'Crop Protection', 500000, 12000, '2026-01-01', '2026-12-31', 'active'),
('ip222222-2222-2222-2222-222222222222', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'f3c3c3c3-3333-3333-3333-333333333333', 'POL-2026-002', 'Nepal Agricultural Insurance Co.', 'Natural Disaster', 800000, 18000, '2026-01-01', '2026-12-31', 'active');

-- Demo Insurance Claims
INSERT INTO insurance_claims (policy_id, user_id, claim_type, description, damage_amount, claimed_amount, ai_verification_score, status) VALUES
('ip111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Flood Damage', 'Partial flooding of rice paddies due to heavy monsoon', 150000, 120000, 78.5, 'under_review');

-- Demo Disaster Reports
INSERT INTO disaster_reports (user_id, farm_id, disaster_type, severity, description, location, latitude, longitude, ai_severity_score, verified) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f1a1a1a1-1111-1111-1111-111111111111', 'flood', 'moderate', 'Moderate flooding in the lower paddy fields after 3 days of continuous rain', 'Chitwan, Nepal', 27.5291, 84.3542, 65.0, TRUE),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'f3c3c3c3-3333-3333-3333-333333333333', 'pest', 'minor', 'Tea mosquito bug infestation detected in northern section', 'Morang, Nepal', 26.6694, 87.2846, 35.0, FALSE);

-- Demo Weather Data
INSERT INTO weather_data (farm_id, temperature, humidity, rainfall_mm, wind_speed, condition, forecast_date) VALUES
('f1a1a1a1-1111-1111-1111-111111111111', 32.5, 78, 12.0, 8.5, 'Partly Cloudy', '2026-08-02'),
('f1a1a1a1-1111-1111-1111-111111111111', 30.0, 82, 25.0, 12.0, 'Rainy', '2026-08-03'),
('f1a1a1a1-1111-1111-1111-111111111111', 33.0, 75, 0.0, 6.0, 'Sunny', '2026-08-04'),
('f2b2b2b2-2222-2222-2222-222222222222', 24.0, 65, 5.0, 10.0, 'Cloudy', '2026-08-02'),
('f3c3c3c3-3333-3333-3333-333333333333', 28.0, 85, 30.0, 15.0, 'Heavy Rain', '2026-08-02');

-- Demo Notifications
INSERT INTO notifications (user_id, title, message, type, read) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sustainability Score Updated', 'Your Green Valley Farm score improved to 82.5!', 'success', FALSE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Weather Alert', 'Heavy rainfall expected in Chitwan region tomorrow', 'warning', FALSE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Carbon Credits Verified', '45 carbon credits have been verified for your farm', 'success', TRUE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Insurance Claim Update', 'Your flood damage claim is under review', 'info', TRUE),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'New Reward Earned', 'You earned 50 points for organic certification!', 'success', FALSE);

-- Demo Rewards
INSERT INTO rewards (user_id, title, description, points, reward_type) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Organic Pioneer', 'Achieved organic certification for Green Valley Farm', 200, 'sustainability'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Carbon Hero', 'Generated first 10 carbon credits', 150, 'carbon'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Water Saver', 'Reduced water usage by 20% through drip irrigation', 100, 'sustainability'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Supply Chain Star', 'Completed full supply chain tracking for rice crop', 200, 'milestone'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Community Leader', 'Referred 5 farmers to Krishi Saarathi platform', 300, 'referral'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Consistency Champion', '6 months of continuous sustainability tracking', 300, 'milestone'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Eco Warrior', 'Achieved 90+ sustainability score', 500, 'sustainability'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Tea Excellence', 'Premium quality tea production with zero pesticides', 200, 'sustainability');
