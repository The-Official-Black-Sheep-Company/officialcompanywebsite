
import psycopg2
import psycopg2.extras
import logging
import json
import sys

# --- Database Setup ---

def get_db_config():
    """Reads database configuration from a 'config.json' file."""
    try:
        with open('barcode_scanner/config.json') as config_file:
            config = json.load(config_file)
            return {
                'host': config['db_host'],
                'port': config.get('db_port', 5432),
                'user': config['db_user'],
                'password': config['db_password'],
                'dbname': config['db_name']
            }
    except FileNotFoundError:
        logging.error("Configuration file 'barcode_scanner/config.json' not found.")
        print("
❌ Configuration file 'barcode_scanner/config.json' not found.")
        print("Please create it with your PostgreSQL database credentials.")
        print("""
Example config.json:
{
  "db_host": "localhost",
  "db_port": 5432,
  "db_user": "your_user",
  "db_password": "your_password",
  "db_name": "your_db"
}
""")
        sys.exit(1)
    except KeyError as e:
        logging.error(f"Missing key in 'config.json': {e}")
        sys.exit(1)

def connect_to_database(config):
    """Establishes a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(**config)
        return conn
    except psycopg2.Error as err:
        logging.error(f"Error connecting to database: {err}")
        return None

def create_inventory_table(conn):
    """Creates the main inventory table if it doesn't exist."""
    try:
        with conn.cursor() as cursor:
            query = """
                CREATE TABLE IF NOT EXISTS Inventory (
                    inventory_id SERIAL PRIMARY KEY,
                    "Product Name" VARCHAR(255) NOT NULL,
                    "Upc#" VARCHAR(255) NOT NULL,
                    "blacksheep #" VARCHAR(255) NOT NULL,
                    "location" VARCHAR(50) NOT NULL,
                    "category" VARCHAR(50) DEFAULT 'uncategorized',
                    "Item Price subtotal" DECIMAL(10, 2) NOT NULL,
                    "Date Listed" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    "scanned_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """
            cursor.execute(query)
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_inventory_upc ON Inventory("Upc#");')
            conn.commit()
            logging.info("Inventory table is ready.")
    except psycopg2.Error as err:
        logging.error(f"Error creating inventory table: {err}")
        conn.rollback()

def create_product_media_table(conn):
    """Creates the product media table if it doesn't exist."""
    try:
        with conn.cursor() as cursor:
            query = """
            CREATE TABLE IF NOT EXISTS Product_Media (
                media_id SERIAL PRIMARY KEY,
                upc VARCHAR(255) NOT NULL,
                photo1_path VARCHAR(500),
                video_path VARCHAR(500),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(upc)
            );
            """
            cursor.execute(query)
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_media_upc ON Product_Media(upc);')
            conn.commit()
            logging.info("Product_Media table is ready.")
    except psycopg2.Error as err:
        logging.error(f"Error creating Product_Media table: {err}")
        conn.rollback()

# --- Data Population ---

def read_products_from_json(file_path='api/products.json'):
    """Reads product data from the specified JSON file."""
    try:
        with open(file_path, 'r') as f:
            products = json.load(f)
        return products
    except FileNotFoundError:
        logging.error(f"Product file not found: {file_path}")
        return []
    except json.JSONDecodeError:
        logging.error(f"Error decoding JSON from {file_path}")
        return []

def insert_product(cursor, product):
    """Inserts a single product into the Inventory table."""
    insert_inventory_query = """
        INSERT INTO Inventory (
            "Product Name", "Upc#", "blacksheep #", "location", "category", "Item Price subtotal"
        ) VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING;
    """
    # Using the product ID as the "blacksheep #" for simplicity
    values = (
        product.get('name'),
        product.get('upc'),
        str(product.get('id')),
        product.get('location', 'A1'),
        product.get('category'),
        product.get('price')
    )
    cursor.execute(insert_inventory_query, values)

def insert_media(cursor, product):
    """Inserts media paths for a product into the Product_Media table."""
    insert_media_query = """
        INSERT INTO Product_Media (
            upc, photo1_path, video_path
        ) VALUES (%s, %s, %s)
        ON CONFLICT (upc) DO NOTHING;
    """
    media_values = (
        product.get('upc'),
        product.get('image'),
        product.get('video')
    )
    cursor.execute(insert_media_query, media_values)

# --- Main Execution ---

def main():
    """Main function to set up the database and populate it with product data."""
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    print("Connecting to the database...")
    db_config = get_db_config()
    conn = connect_to_database(db_config)

    if not conn:
        print("Database connection failed. Please check your config and database server.")
        return

    print("Setting up database tables...")
    create_inventory_table(conn)
    create_product_media_table(conn)

    print("Reading products from 'api/products.json'...")
    products = read_products_from_json()

    if not products:
        print("No products found to insert.")
        conn.close()
        return

    print(f"Found {len(products)} products. Inserting into the database...")
    try:
        with conn.cursor() as cursor:
            for product in products:
                insert_product(cursor, product)
                insert_media(cursor, product)
        conn.commit()
        print(f"✅ Successfully inserted/updated {len(products)} products into the database.")
    except psycopg2.Error as err:
        logging.error(f"A database error occurred: {err}")
        print("❌ An error occurred during database insertion. The transaction has been rolled back.")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    main()
