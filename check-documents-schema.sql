-- Run this in Supabase SQL Editor to see the actual structure of your documents table

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'documents'
ORDER BY 
    ordinal_position;
