import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    const jsonPath = path.join(process.cwd(), 'src/data/all_prompts.json');
    console.log(`📖 Reading data from ${jsonPath}...`);

    try {
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const prompts = JSON.parse(rawData);

        console.log(`📊 Found ${prompts.length} prompts to migrate.`);

        // Map JSON fields to DB Schema
        const formattedData = prompts.map((p: any) => ({
            id: p.id,
            title: p.title || "Untitled",
            prompt: p.prompt_en || p.prompt || "",
            summary: p.summary || "",
            categories: p.tags || [],
            author: p.original_source?.name || "Unknown",
            date: p.date || new Date().toISOString(),
            images: p.images || [],
            featured: p.featured || false,
            prompt_cn: p.prompt_cn || "",
            model: p.model || "Nano banana pro"
        }));

        // Batch insert (Supabase has limits, so chunking often helps, but let's try 100 at a time)
        const BATCH_SIZE = 100;
        let totalInserted = 0;

        for (let i = 0; i < formattedData.length; i += BATCH_SIZE) {
            const batch = formattedData.slice(i, i + BATCH_SIZE);
            const { error } = await supabase.from('banana_prompts').upsert(batch, { onConflict: 'id' });

            if (error) {
                console.error(`❌ Error inserting batch ${i}-${i + BATCH_SIZE}:`, error.message);
            } else {
                totalInserted += batch.length;
                console.log(`✅ Progress: ${totalInserted}/${formattedData.length} prompts migrated.`);
            }
        }

        console.log("\n🎉 Migration Complete!");
        console.log(`Total Prompts in DB: ${totalInserted}`);

    } catch (err) {
        console.error("❌ Unexpected Error:", err);
    }
}

migrate();
