-- Krishi Saarathi Database Schema
-- PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    photo_url TEXT,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'farmer' CHECK (role IN ('farmer', 'buyer', 'admin', 'verifier')),
    reward_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FARMS
-- ============================================
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(500),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    area_hectares DOUBLE PRECISION,
    soil_type VARCHAR(100),
    irrigation_type VARCHAR(100),
    organic_certified BOOLEAN DEFAULT FALSE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_farms_user ON farms(user_id);

-- ============================================
-- CROPS
-- ============================================
CREATE TABLE crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    variety VARCHAR(255),
    planting_date DATE,
    expected_harvest DATE,
    actual_harvest DATE,
    area_hectares DOUBLE PRECISION,
    yield_kg DOUBLE PRECISION,
    health_status VARCHAR(20) DEFAULT 'good' CHECK (health_status IN ('excellent', 'good', 'fair', 'poor', 'critical')),
    status VARCHAR(20) DEFAULT 'growing' CHECK (status IN ('planned', 'growing', 'harvested', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_crops_farm ON crops(farm_id);

-- ============================================
-- SUSTAINABILITY SCORES
-- ============================================
CREATE TABLE sustainability_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    overall_score DOUBLE PRECISION NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    water_score DOUBLE PRECISION DEFAULT 0,
    soil_score DOUBLE PRECISION DEFAULT 0,
    biodiversity_score DOUBLE PRECISION DEFAULT 0,
    carbon_score DOUBLE PRECISION DEFAULT 0,
    waste_score DOUBLE PRECISION DEFAULT 0,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sustainability_farm ON sustainability_scores(farm_id);

-- ============================================
-- CARBON CREDITS
-- ============================================
CREATE TABLE carbon_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credits_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
    credits_available DOUBLE PRECISION NOT NULL DEFAULT 0,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_at TIMESTAMP WITH TIME ZONE,
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_carbon_user ON carbon_credits(user_id);
CREATE INDEX idx_carbon_farm ON carbon_credits(farm_id);

-- ============================================
-- CARBON TRANSACTIONS
-- ============================================
CREATE TABLE carbon_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id),
    buyer_id UUID REFERENCES users(id),
    credit_id UUID NOT NULL REFERENCES carbon_credits(id),
    amount DOUBLE PRECISION NOT NULL,
    price_per_credit DOUBLE PRECISION NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transactions_seller ON carbon_transactions(seller_id);
CREATE INDEX idx_transactions_buyer ON carbon_transactions(buyer_id);

-- ============================================
-- MARKETPLACE LISTINGS
-- ============================================
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credit_id UUID NOT NULL REFERENCES carbon_credits(id),
    amount DOUBLE PRECISION NOT NULL,
    price_per_credit DOUBLE PRECISION NOT NULL,
    min_purchase DOUBLE PRECISION DEFAULT 1,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled', 'expired')),
    listed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_listings_status ON marketplace_listings(status);

-- ============================================
-- SUPPLY CHAIN EVENTS
-- ============================================
CREATE TABLE supply_chain_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id UUID REFERENCES crops(id),
    farm_id UUID NOT NULL REFERENCES farms(id),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('planted', 'fertilized', 'irrigated', 'treated', 'harvested', 'processed', 'packaged', 'shipped', 'delivered', 'sold')),
    description TEXT,
    location VARCHAR(500),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    actor_name VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    qr_code VARCHAR(255),
    event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_supply_chain_crop ON supply_chain_events(crop_id);
CREATE INDEX idx_supply_chain_farm ON supply_chain_events(farm_id);
CREATE INDEX idx_supply_chain_qr ON supply_chain_events(qr_code);

-- ============================================
-- INSURANCE POLICIES
-- ============================================
CREATE TABLE insurance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    provider VARCHAR(255),
    coverage_type VARCHAR(100),
    coverage_amount DOUBLE PRECISION,
    premium DOUBLE PRECISION,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'claimed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_policies_user ON insurance_policies(user_id);

-- ============================================
-- INSURANCE CLAIMS
-- ============================================
CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID NOT NULL REFERENCES insurance_policies(id),
    user_id UUID NOT NULL REFERENCES users(id),
    claim_type VARCHAR(100) NOT NULL,
    description TEXT,
    damage_amount DOUBLE PRECISION,
    claimed_amount DOUBLE PRECISION,
    approved_amount DOUBLE PRECISION,
    evidence_urls TEXT[],
    ai_verification_score DOUBLE PRECISION,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'verified', 'approved', 'rejected', 'paid')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_claims_policy ON insurance_claims(policy_id);
CREATE INDEX idx_claims_user ON insurance_claims(user_id);

-- ============================================
-- DISASTER REPORTS
-- ============================================
CREATE TABLE disaster_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    farm_id UUID REFERENCES farms(id),
    disaster_type VARCHAR(100) NOT NULL CHECK (disaster_type IN ('flood', 'drought', 'storm', 'pest', 'disease', 'fire', 'earthquake', 'landslide', 'hail', 'frost', 'other')),
    severity VARCHAR(20) DEFAULT 'moderate' CHECK (severity IN ('minor', 'moderate', 'severe', 'catastrophic')),
    description TEXT,
    location VARCHAR(500),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_urls TEXT[],
    ai_severity_score DOUBLE PRECISION,
    verified BOOLEAN DEFAULT FALSE,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_disasters_user ON disaster_reports(user_id);
CREATE INDEX idx_disasters_farm ON disaster_reports(farm_id);

-- ============================================
-- WEATHER DATA
-- ============================================
CREATE TABLE weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    rainfall_mm DOUBLE PRECISION,
    wind_speed DOUBLE PRECISION,
    condition VARCHAR(100),
    forecast_date DATE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_weather_farm ON weather_data(farm_id);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'alert')),
    read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- ============================================
-- REWARDS
-- ============================================
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER NOT NULL,
    reward_type VARCHAR(50) CHECK (reward_type IN ('sustainability', 'carbon', 'community', 'milestone', 'referral')),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rewards_user ON rewards(user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
