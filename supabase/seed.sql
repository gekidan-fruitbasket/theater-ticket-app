-- =============================================
-- Seed Data for Theater Ticket Reservation App
-- =============================================

-- =============================================
-- テスト用ユーザー
-- =============================================
INSERT INTO profiles (id, line_user_id, display_name)
VALUES (
    'bd5d8438-497d-4367-8b00-ad154f8ef531',
    'test_line_user_001',
    'テストユーザー'
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- テスト用劇場
-- =============================================
INSERT INTO venues (id, name, layout_data)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'テスト劇場',
    '{
        "rows": [
            {
                "label": "A",
                "seats": [
                    { "id": "A-1", "type": "seat" },
                    { "id": "A-2", "type": "seat" },
                    { "id": "A-3", "type": "seat" },
                    { "id": null, "type": "aisle" },
                    { "id": "A-4", "type": "seat" },
                    { "id": "A-5", "type": "seat" },
                    { "id": "A-6", "type": "seat" }
                ]
            },
            {
                "label": "B",
                "seats": [
                    { "id": "B-1", "type": "seat" },
                    { "id": "B-2", "type": "seat" },
                    { "id": "B-3", "type": "seat" },
                    { "id": null, "type": "aisle" },
                    { "id": "B-4", "type": "seat" },
                    { "id": "B-5", "type": "seat" },
                    { "id": "B-6", "type": "seat" }
                ]
            },
            {
                "label": "C",
                "seats": [
                    { "id": "C-1", "type": "seat" },
                    { "id": "C-2", "type": "seat" },
                    { "id": "C-3", "type": "seat" },
                    { "id": null, "type": "aisle" },
                    { "id": "C-4", "type": "seat" },
                    { "id": "C-5", "type": "seat" },
                    { "id": "C-6", "type": "seat" }
                ]
            }
        ]
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- テスト用公演
-- =============================================
INSERT INTO performances (id, venue_id, title, start_time)
VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'テスト公演',
    '2026-02-01 14:00:00+09'
) ON CONFLICT (id) DO NOTHING;
