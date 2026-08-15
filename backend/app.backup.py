from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

CORS(app)

DATABASE_URL = (
    "dbname=ecommerce "
    "user=postgres "
    "password=1234567 "
    "host=localhost "
    "port=5432"
)


# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():
    return jsonify({
        "message": "E-Commerce Backend API is running"
    })


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health")
def health():
    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()

        return jsonify({
            "status": "healthy",
            "database": "connected"
        })

    except Exception as error:
        return jsonify({
            "status": "error",
            "database": "disconnected",
            "message": str(error)
        }), 500


# ============================================================
# GET ALL PRODUCTS
# ============================================================

@app.route("/api/products", methods=["GET"])
def get_products():
    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:

                cursor.execute("""
                    SELECT
                        id,
                        name,
                        description,
                        price,
                        image_url
                    FROM products
                    ORDER BY id
                """)

                rows = cursor.fetchall()

        products = []

        for row in rows:
            products.append({
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "price": float(row[3]),
                "image_url": row[4]
            })

        return jsonify(products)

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ============================================================
# GET SINGLE PRODUCT
# ============================================================

@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:

                cursor.execute("""
                    SELECT
                        id,
                        name,
                        description,
                        price,
                        image_url
                    FROM products
                    WHERE id = %s
                """, (product_id,))

                row = cursor.fetchone()

        if row is None:
            return jsonify({
                "error": "Product not found"
            }), 404

        product = {
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "price": float(row[3]),
            "image_url": row[4]
        }

        return jsonify(product)

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ============================================================
# CREATE PRODUCT
# ============================================================

@app.route("/api/products", methods=["POST"])
def create_product():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    name = data.get("name", "").strip()
    description = data.get("description", "").strip()
    price = data.get("price")
    image_url = data.get("image_url", "").strip()

    if not name:
        return jsonify({
            "error": "Product name is required"
        }), 400

    if price is None:
        return jsonify({
            "error": "Product price is required"
        }), 400

    try:
        price = float(price)

        if price <= 0:
            return jsonify({
                "error": "Product price must be greater than zero"
            }), 400

    except (TypeError, ValueError):
        return jsonify({
            "error": "Product price must be a valid number"
        }), 400

    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:

                cursor.execute("""
                    INSERT INTO products
                        (
                            name,
                            description,
                            price,
                            image_url
                        )
                    VALUES
                        (%s, %s, %s, %s)
                    RETURNING
                        id,
                        name,
                        description,
                        price,
                        image_url,
                        created_at
                """, (
                    name,
                    description,
                    price,
                    image_url
                ))

                product = cursor.fetchone()

            connection.commit()

        return jsonify({
            "message": "Product created successfully",
            "product": {
                "id": product[0],
                "name": product[1],
                "description": product[2],
                "price": float(product[3]),
                "image_url": product[4],
                "created_at": product[5].isoformat()
            }
        }), 201

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ============================================================
# UPDATE PRODUCT
# ============================================================

@app.route("/api/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    name = data.get("name", "").strip()
    description = data.get("description", "").strip()
    price = data.get("price")
    image_url = data.get("image_url", "").strip()

    if not name:
        return jsonify({
            "error": "Product name is required"
        }), 400

    if price is None:
        return jsonify({
            "error": "Product price is required"
        }), 400

    try:
        price = float(price)

    except (TypeError, ValueError):
        return jsonify({
            "error": "Product price must be a valid number"
        }), 400

    if price <= 0:
        return jsonify({
            "error": "Product price must be greater than zero"
        }), 400

    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:

                # Check product exists
                cursor.execute("""
                    SELECT id
                    FROM products
                    WHERE id = %s
                """, (product_id,))

                product = cursor.fetchone()

                if product is None:
                    return jsonify({
                        "error": "Product not found"
                    }), 404

                # Update product
                cursor.execute("""
                    UPDATE products
                    SET
                        name = %s,
                        description = %s,
                        price = %s,
                        image_url = %s
                    WHERE id = %s
                    RETURNING
                        id,
                        name,
                        description,
                        price,
                        image_url,
                        created_at
                """, (
                    name,
                    description,
                    price,
                    image_url,
                    product_id
                ))

                updated_product = cursor.fetchone()

            connection.commit()

        return jsonify({
            "message": "Product updated successfully",
            "product": {
                "id": updated_product[0],
                "name": updated_product[1],
                "description": updated_product[2],
                "price": float(updated_product[3]),
                "image_url": updated_product[4],
                "created_at": updated_product[5].isoformat()
            }
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ============================================================
# DELETE PRODUCT
# ============================================================

@app.route("/api/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:

                cursor.execute("""
                    SELECT id
                    FROM products
                    WHERE id = %s
                """, (product_id,))

                product = cursor.fetchone()

                if product is None:
                    return jsonify({
                        "error": "Product not found"
                    }), 404

                cursor.execute("""
                    DELETE FROM products
                    WHERE id = %s
                """, (product_id,))

            connection.commit()

        return jsonify({
            "message": "Product deleted successfully",
            "product_id": product_id
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ============================================================
# REGISTER
# ============================================================

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({
            "error": "Name, email and password are required"
        }), 400

    if len(password) < 6:
        return jsonify({
            "error": "Password must be at least 6 characters"
        }), 400

    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:

                cursor.execute("""
                    SELECT id
                    FROM users
                    WHERE email = %s
                """, (email,))

                existing_user = cursor.fetchone()

                if existing_user:
                    return jsonify({
                        "error": "Email already registered"
                    }), 409

                password_hash = generate_password_hash(password)

                cursor.execute("""
                    INSERT INTO users
                        (
                            name,
                            email,
                            password
                        )
                    VALUES
                        (%s, %s, %s)
                    RETURNING
                        id,
                        name,
                        email,
                        role,
                        created_at
                """, (
                    name,
                    email,
                    password_hash
                ))

                user = cursor.fetchone()

            connection.commit()

        return jsonify({
            "message": "Registration successful",
            "user": {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "role": user[3],
                "created_at": user[4].isoformat()
            }
        }), 201

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ============================================================
# LOGIN
# ============================================================

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:

                cursor.execute("""
                    SELECT
                        id,
                        name,
                        email,
                        password,
                        role
                    FROM users
                    WHERE email = %s
                """, (email,))

                user = cursor.fetchone()

        if user is None:
            return jsonify({
                "error": "Invalid email or password"
            }), 401

        password_valid = check_password_hash(
            user[3],
            password
        )

        if not password_valid:
            return jsonify({
                "error": "Invalid email or password"
            }), 401

        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "role": user[4]
            }
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ============================================================
# CREATE ORDER
# ============================================================

@app.route("/api/orders", methods=["POST"])
def create_order():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    user_id = data.get("user_id")

    shipping_address = data.get(
        "shipping_address",
        ""
    ).strip()

    items = data.get("items", [])

    if not user_id:
        return jsonify({
            "error": "user_id is required"
        }), 400

    if not shipping_address:
        return jsonify({
            "error": "Shipping address is required"
        }), 400

    if not items:
        return jsonify({
            "error": "Order must contain at least one item"
        }), 400

    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:

                cursor.execute("""
                    SELECT id
                    FROM users
                    WHERE id = %s
                """, (user_id,))

                user = cursor.fetchone()

                if user is None:
                    return jsonify({
                        "error": "User not found"
                    }), 404

                total_amount = 0
                validated_items = []

                for item in items:

                    product_id = item.get("product_id")
                    quantity = item.get("quantity")

                    if not product_id or not quantity:
                        return jsonify({
                            "error": (
                                "Each item requires "
                                "product_id and quantity"
                            )
                        }), 400

                    try:
                        quantity = int(quantity)

                    except (TypeError, ValueError):
                        return jsonify({
                            "error": (
                                "Quantity must be "
                                "a valid number"
                            )
                        }), 400

                    if quantity <= 0:
                        return jsonify({
                            "error": (
                                "Quantity must be "
                                "greater than zero"
                            )
                        }), 400

                    cursor.execute("""
                        SELECT
                            id,
                            name,
                            price
                        FROM products
                        WHERE id = %s
                    """, (product_id,))

                    product = cursor.fetchone()

                    if product is None:
                        return jsonify({
                            "error": (
                                f"Product {product_id} "
                                "not found"
                            )
                        }), 404

                    price = float(product[2])

                    item_total = price * quantity

                    total_amount += item_total

                    validated_items.append({
                        "product_id": product[0],
                        "name": product[1],
                        "quantity": quantity,
                        "price": price
                    })

                cursor.execute("""
                    INSERT INTO orders
                        (
                            user_id,
                            total_amount,
                            status,
                            shipping_address
                        )
                    VALUES
                        (%s, %s, %s, %s)
                    RETURNING
                        id,
                        user_id,
                        total_amount,
                        status,
                        shipping_address,
                        created_at
                """, (
                    user_id,
                    total_amount,
                    "pending",
                    shipping_address
                ))

                order = cursor.fetchone()

                for item in validated_items:

                    cursor.execute("""
                        INSERT INTO order_items
                            (
                                order_id,
                                product_id,
                                quantity,
                                price
                            )
                        VALUES
                            (%s, %s, %s, %s)
                    """, (
                        order[0],
                        item["product_id"],
                        item["quantity"],
                        item["price"]
                    ))

            connection.commit()

        return jsonify({
            "message": "Order created successfully",
            "order": {
                "id": order[0],
                "user_id": order[1],
                "total_amount": float(order[2]),
                "status": order[3],
                "shipping_address": order[4],
                "created_at": order[5].isoformat(),
                "items": validated_items
            }
        }), 201

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ============================================================
# GET USER ORDERS
# ============================================================

@app.route("/api/orders/<int:user_id>", methods=["GET"])
def get_orders(user_id):
    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:

                cursor.execute("""
                    SELECT
                        id,
                        user_id,
                        total_amount,
                        status,
                        shipping_address,
                        created_at
                    FROM orders
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                """, (user_id,))

                orders = cursor.fetchall()

                result = []

                for order in orders:

                    cursor.execute("""
                        SELECT
                            oi.product_id,
                            p.name,
                            oi.quantity,
                            oi.price
                        FROM order_items oi
                        JOIN products p
                            ON p.id = oi.product_id
                        WHERE oi.order_id = %s
                        ORDER BY oi.id
                    """, (order[0],))

                    item_rows = cursor.fetchall()

                    items = []

                    for item in item_rows:
                        items.append({
                            "product_id": item[0],
                            "name": item[1],
                            "quantity": item[2],
                            "price": float(item[3])
                        })

                    result.append({
                        "id": order[0],
                        "user_id": order[1],
                        "total_amount": float(order[2]),
                        "status": order[3],
                        "shipping_address": order[4],
                        "created_at": order[5].isoformat(),
                        "items": items
                    })

        return jsonify(result)

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500

# ============================================================
# ADMIN - GET ALL ORDERS
# ============================================================

@app.route("/api/admin/orders", methods=["GET"])
def get_all_orders():
    try:
        with psycopg.connect(DATABASE_URL) as connection:
            with connection.cursor() as cursor:

                cursor.execute("""
                    SELECT
                        o.id,
                        o.user_id,
                        u.name,
                        u.email,
                        o.total_amount,
                        o.status,
                        o.shipping_address,
                        o.created_at
                    FROM orders o
                    JOIN users u
                        ON u.id = o.user_id
                    ORDER BY o.created_at DESC
                """)

                orders = cursor.fetchall()

                result = []

                for order in orders:

                    cursor.execute("""
                        SELECT
                            oi.product_id,
                            p.name,
                            oi.quantity,
                            oi.price
                        FROM order_items oi
                        JOIN products p
                            ON p.id = oi.product_id
                        WHERE oi.order_id = %s
                        ORDER BY oi.id
                    """, (order[0],))

                    item_rows = cursor.fetchall()

                    items = []

                    for item in item_rows:
                        items.append({
                            "product_id": item[0],
                            "name": item[1],
                            "quantity": item[2],
                            "price": float(item[3])
                        })

                    result.append({
                        "id": order[0],
                        "user_id": order[1],
                        "user_name": order[2],
                        "user_email": order[3],
                        "total_amount": float(order[4]),
                        "status": order[5],
                        "shipping_address": order[6],
                        "created_at": order[7].isoformat(),
                        "items": items
                    })

        return jsonify(result)

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


# ============================================================
# START FLASK
# ============================================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )