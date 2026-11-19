// @ts-nocheck
// Daftar taxonomy dari plugin evrocks (wp-content/plugins/evrocks/context/*.php).
// `key` = nama taxonomy di register_taxonomy(). Tidak ada rest_base khusus,
// jadi endpoint REST-nya sama dengan key: /wp/v2/{key}
export const TAXONOMIES = {
    archive: [
         // key = slug endpoint di WP (/wp/v2/archive-classification)
        // label = tulisan di tombol/judul UI
        // hierarchical = true jika punya Parent/Induk (seperti Kategori), false jika datar (seperti Tag)
        { key: 'archive-classification', label: 'Classification', hierarchical: true },
        { key: 'archive-creator', label: 'Creators', hierarchical: false },
        { key: 'exhibition_theme', label: 'Exhibition Themes', hierarchical: true },
        { key: 'archive-format', label: 'Formats', hierarchical: false },
        { key: 'archive-location', label: 'Locations', hierarchical: false },
        { key: 'archive-studio', label: 'Studios', hierarchical: false },
        { key: 'archive-subject', label: 'Subjects', hierarchical: false }
    ],
    exhibition: [{ key: 'exhibition_theme', label: 'Exhibition Themes', hierarchical: true }]
};

// Mencari 1 taxonomy berdasarkan tab ('archive'/'exhibition') dan key-nya.
// Jika tidak ada di daftar, kembalikan null (mencegah user menembak endpoint sembarangan).
export function get_taxonomy(tab, key) {
    return TAXONOMIES[tab]?.find((t) => t.key === key) ?? null;
}

// cara mengedit? 
// Kalau di WordPress ditambah taxonomy baru, cukup tambahkan
// `{ key: 'slug-wp', label: 'Nama UI', hierarchical: false }` 
// ke array `archive` atau `exhibition`.
