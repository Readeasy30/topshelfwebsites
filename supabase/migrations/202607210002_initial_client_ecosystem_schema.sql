-- TopShelfWebsites Core Client Ecosystem Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE client_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    domain_name VARCHAR(255) UNIQUE NOT NULL,
    github_repo_url VARCHAR(255),
    cloudflare_project_id VARCHAR(255),
    deployment_status VARCHAR(50) DEFAULT 'pending',
    pages_count INT DEFAULT 4,
    go_live_deadline TIMESTAMP WITH TIME ZONE,
    launched_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    site_id UUID REFERENCES client_sites(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    monthly_fee NUMERIC(10,2) DEFAULT 49.00,
    upfront_paid NUMERIC(10,2) DEFAULT 199.00,
    billing_status VARCHAR(50) DEFAULT 'active',
    next_billing_date DATE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES client_sites(id) ON DELETE CASCADE,
    section_name VARCHAR(100) NOT NULL,
    content_key VARCHAR(100) NOT NULL,
    content_value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_client_sites_status ON client_sites(deployment_status);
CREATE INDEX idx_subscriptions_status ON subscriptions(billing_status);
CREATE INDEX idx_site_content_site ON site_content(site_id);
