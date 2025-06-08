-- Migration 009: Create Advanced Payment Processing Tables
-- WebduhVercel Database Migration
-- Created: 2024-02-06

-- Payment Providers Configuration Table
CREATE TABLE payment_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- stripe, paypal, square, adyen, etc.
    display_name VARCHAR(255) NOT NULL,
    provider_type VARCHAR(50) NOT NULL, -- payment_processor, digital_wallet, bank_transfer, crypto
    supported_currencies TEXT[] DEFAULT '{}',
    supported_countries TEXT[] DEFAULT '{}',
    configuration JSONB DEFAULT '{}', -- API keys, webhooks, settings
    is_active BOOLEAN DEFAULT TRUE,
    is_sandbox BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 0, -- Provider selection priority
    processing_fees JSONB DEFAULT '{}', -- Fee structure
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Intents Table (Stripe-like payment intents)
CREATE TABLE payment_intents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255), -- Provider's payment intent ID
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES billing_subscriptions(id),
    provider_id UUID NOT NULL REFERENCES payment_providers(id),
    amount INTEGER NOT NULL, -- Amount in cents
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'requires_payment_method', -- requires_payment_method, requires_confirmation, requires_action, processing, requires_capture, canceled, succeeded
    payment_method_id UUID REFERENCES payment_methods(id),
    customer_id VARCHAR(255), -- External customer ID
    description TEXT,
    metadata JSONB DEFAULT '{}',
    client_secret VARCHAR(255), -- For frontend integration
    confirmation_method VARCHAR(50) DEFAULT 'automatic', -- automatic, manual
    capture_method VARCHAR(50) DEFAULT 'automatic', -- automatic, manual
    setup_future_usage VARCHAR(50), -- on_session, off_session
    receipt_email VARCHAR(255),
    shipping JSONB DEFAULT '{}',
    statement_descriptor VARCHAR(22),
    transfer_data JSONB DEFAULT '{}',
    application_fee_amount INTEGER,
    last_payment_error JSONB DEFAULT '{}',
    next_action JSONB DEFAULT '{}',
    processing_at TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Transactions Table
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255), -- Provider's transaction ID
    payment_intent_id UUID REFERENCES payment_intents(id),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- payment, refund, chargeback, fee, adjustment
    status VARCHAR(50) NOT NULL, -- pending, processing, succeeded, failed, canceled, disputed
    amount INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    net_amount INTEGER, -- Amount after fees
    fee_amount INTEGER DEFAULT 0,
    provider_fee_amount INTEGER DEFAULT 0,
    platform_fee_amount INTEGER DEFAULT 0,
    description TEXT,
    failure_code VARCHAR(50),
    failure_message TEXT,
    risk_score DECIMAL(3,2), -- 0.00 to 1.00
    risk_level VARCHAR(20), -- low, medium, high, blocked
    payment_method_details JSONB DEFAULT '{}',
    billing_details JSONB DEFAULT '{}',
    receipt_url TEXT,
    dispute_reason VARCHAR(100),
    evidence JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refunds Table
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255), -- Provider's refund ID
    payment_transaction_id UUID NOT NULL REFERENCES payment_transactions(id),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    reason VARCHAR(50), -- duplicate, fraudulent, requested_by_customer, expired_uncaptured_charge
    status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed, canceled
    failure_reason VARCHAR(100),
    receipt_number VARCHAR(255),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Disputes Table
CREATE TABLE payment_disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255), -- Provider's dispute ID
    payment_transaction_id UUID NOT NULL REFERENCES payment_transactions(id),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    reason VARCHAR(100) NOT NULL, -- credit_not_processed, duplicate, fraudulent, etc.
    status VARCHAR(50) NOT NULL, -- warning_needs_response, warning_under_review, warning_closed, needs_response, under_review, charge_refunded, won, lost
    evidence_due_by TIMESTAMPTZ,
    evidence_submission_count INTEGER DEFAULT 0,
    evidence JSONB DEFAULT '{}',
    evidence_details JSONB DEFAULT '{}',
    is_charge_refundable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fraud Detection Rules Table
CREATE TABLE fraud_detection_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL, -- velocity, amount, geography, device, email, ip, card
    conditions JSONB NOT NULL, -- Rule conditions and thresholds
    action VARCHAR(50) NOT NULL, -- block, review, allow, require_3ds
    risk_score_adjustment DECIMAL(3,2) DEFAULT 0.00, -- -1.00 to 1.00
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Sessions Table (for checkout sessions)
CREATE TABLE payment_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255), -- Provider's session ID
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    mode VARCHAR(50) NOT NULL, -- payment, setup, subscription
    status VARCHAR(50) DEFAULT 'open', -- open, complete, expired
    url TEXT, -- Checkout URL
    success_url TEXT,
    cancel_url TEXT,
    payment_intent_id UUID REFERENCES payment_intents(id),
    subscription_id UUID REFERENCES billing_subscriptions(id),
    customer_email VARCHAR(255),
    line_items JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Method Tokens Table (for secure storage)
CREATE TABLE payment_method_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    payment_method_id UUID NOT NULL REFERENCES payment_methods(id),
    provider_id UUID NOT NULL REFERENCES payment_providers(id),
    external_token VARCHAR(255) NOT NULL, -- Provider's token
    fingerprint VARCHAR(64), -- Unique fingerprint for deduplication
    customer_id VARCHAR(255), -- External customer ID
    is_default BOOLEAN DEFAULT FALSE,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Analytics Table
CREATE TABLE payment_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_volume INTEGER DEFAULT 0, -- Total payment volume in cents
    total_count INTEGER DEFAULT 0,
    successful_volume INTEGER DEFAULT 0,
    successful_count INTEGER DEFAULT 0,
    failed_volume INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    refunded_volume INTEGER DEFAULT 0,
    refunded_count INTEGER DEFAULT 0,
    disputed_volume INTEGER DEFAULT 0,
    disputed_count INTEGER DEFAULT 0,
    average_transaction_amount INTEGER DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    top_failure_reasons JSONB DEFAULT '{}',
    geographic_breakdown JSONB DEFAULT '{}',
    payment_method_breakdown JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, date, currency)
);

-- Payout Schedules Table
CREATE TABLE payout_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES payment_providers(id),
    frequency VARCHAR(50) NOT NULL, -- daily, weekly, monthly, manual
    day_of_week INTEGER, -- 1-7 for weekly
    day_of_month INTEGER, -- 1-31 for monthly
    minimum_amount INTEGER DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    destination_account JSONB NOT NULL, -- Bank account details
    is_active BOOLEAN DEFAULT TRUE,
    next_payout_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payouts Table
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255), -- Provider's payout ID
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES payout_schedules(id),
    amount INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL, -- pending, in_transit, paid, failed, canceled
    description TEXT,
    statement_descriptor VARCHAR(255),
    arrival_date DATE,
    failure_code VARCHAR(50),
    failure_message TEXT,
    destination_account JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Payment Processing
CREATE INDEX idx_payment_providers_name ON payment_providers(name);
CREATE INDEX idx_payment_providers_is_active ON payment_providers(is_active);

CREATE INDEX idx_payment_intents_team_id ON payment_intents(team_id);
CREATE INDEX idx_payment_intents_external_id ON payment_intents(external_id);
CREATE INDEX idx_payment_intents_status ON payment_intents(status);
CREATE INDEX idx_payment_intents_created_at ON payment_intents(created_at);

CREATE INDEX idx_payment_transactions_team_id ON payment_transactions(team_id);
CREATE INDEX idx_payment_transactions_payment_intent_id ON payment_transactions(payment_intent_id);
CREATE INDEX idx_payment_transactions_type ON payment_transactions(type);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at);

CREATE INDEX idx_refunds_team_id ON refunds(team_id);
CREATE INDEX idx_refunds_payment_transaction_id ON refunds(payment_transaction_id);
CREATE INDEX idx_refunds_status ON refunds(status);

CREATE INDEX idx_payment_disputes_team_id ON payment_disputes(team_id);
CREATE INDEX idx_payment_disputes_status ON payment_disputes(status);
CREATE INDEX idx_payment_disputes_evidence_due_by ON payment_disputes(evidence_due_by);

CREATE INDEX idx_fraud_detection_rules_is_active ON fraud_detection_rules(is_active);
CREATE INDEX idx_fraud_detection_rules_rule_type ON fraud_detection_rules(rule_type);

CREATE INDEX idx_payment_sessions_team_id ON payment_sessions(team_id);
CREATE INDEX idx_payment_sessions_external_id ON payment_sessions(external_id);
CREATE INDEX idx_payment_sessions_status ON payment_sessions(status);

CREATE INDEX idx_payment_method_tokens_team_id ON payment_method_tokens(team_id);
CREATE INDEX idx_payment_method_tokens_fingerprint ON payment_method_tokens(fingerprint);

CREATE INDEX idx_payment_analytics_team_id_date ON payment_analytics(team_id, date);
CREATE INDEX idx_payment_analytics_date ON payment_analytics(date);

CREATE INDEX idx_payout_schedules_team_id ON payout_schedules(team_id);
CREATE INDEX idx_payout_schedules_next_payout_date ON payout_schedules(next_payout_date);

CREATE INDEX idx_payouts_team_id ON payouts(team_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_arrival_date ON payouts(arrival_date);

-- Add migration tracking
INSERT INTO schema_migrations (version, description) 
VALUES (9, 'Create advanced payment processing tables')
ON CONFLICT (version) DO NOTHING; 