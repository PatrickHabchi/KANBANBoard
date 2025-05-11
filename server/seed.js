const pool = require("./config/db");

const seed = async () => {
    try {
        await pool.query("DELETE FROM logs");
        await pool.query("DELETE FROM tasks");
        await pool.query("DELETE FROM tags");
        await pool.query("DELETE FROM columns");

        const columns = ["Today", "This Week", "Later"];

        
        for (let i = 0; i < columns.length; i++) {
            await pool.query (
                "INSERT INTO columns (title, position) VALUES ($1, $2)",
                [columns[i], i + 1]
            );
        }
        
        const tags = [
            { name: "Urgent", color: "red"},
            { name: "High Priority", color: "orange"},
            { name: "Low Priority", color: "green"}
        ];

        for (const tag of tags) {
            await pool.query(
              "INSERT INTO tags (name, color) VALUES ($1, $2)",
              [tag.name, tag.color]
            );
          }
          
        console.log("Database seeded with default columns");
        process.exit(0);      
    } catch (err) {
        console.log("Seedin error", err);
        process.exit(1);
    }
}

seed();