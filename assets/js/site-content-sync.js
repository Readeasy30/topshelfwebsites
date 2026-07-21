// TopShelfWebsites Headless Content Sync Engine

const CDN_DB_URL = "https://supabase.co";
const CDN_PUBLIC_KEY = "YOUR_SUPABASE_ANON_KEY";

// Injected automatically during client deployment
const SYSTEM_SITE_ID = "PASTE_ASSIGNED_CLIENT_SITE_UUID_HERE";

async function syncLocalSiteAssets() {
  try {
    const response = await fetch(
      `${CDN_DB_URL}/rest/v1/site_content?site_id=eq.${SYSTEM_SITE_ID}`,
      {
        method: "GET",
        headers: {
          apikey: CDN_PUBLIC_KEY,
          Authorization: `Bearer ${CDN_PUBLIC_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Content sync failed: ${response.statusText}`);
    }

    const textPayloads = await response.json();

    textPayloads.forEach((asset) => {
      mapDataToDOMElement(
        asset.section_name,
        asset.content_key,
        asset.content_value
      );
    });
  } catch (err) {
    console.warn("Dynamic content fallback active:", err.message);
  }
}

function mapDataToDOMElement(section, key, value) {
  const target = document.querySelector(
    `[data-section="${section}"][data-key="${key}"]`
  );

  if (target) {
    target.textContent = value;
  }
}

document.addEventListener("DOMContentLoaded", syncLocalSiteAssets);
