import pandas as pd
import numpy as np
import os
from datetime import datetime
from app.database import SessionLocal, engine
from app import models


def parse_datetime(val):
    if pd.isna(val) or val in ["", "NaT"]:
        return None
    try:
        return pd.to_datetime(val).to_pydatetime()
    except:
        return None


def clean_row_for_model(row, model_class):
    cleaned = {}
    for column in row.index:
        val = row[column]

        if pd.isna(val) or val in ["", "NaN", "nan"]:
            cleaned[column] = None
            continue

        # Cast integer columns properly
        attr_type = getattr(model_class, column).type
        try:
            if isinstance(attr_type, (models.Integer().type.__class__, )):
                cleaned[column] = int(val)
            elif isinstance(attr_type, (models.Float().type.__class__, )):
                cleaned[column] = float(val)
            elif isinstance(attr_type, (models.DateTime().type.__class__, )):
                cleaned[column] = parse_datetime(val)
            else:
                cleaned[column] = val
        except:
            cleaned[column] = val  # fallback to original

    return cleaned


def load_csv_to_table(model_class, csv_file, db_session, column_mapping=None):
    df = pd.read_csv(csv_file)

    if column_mapping:
        df = df.rename(columns=column_mapping)

    df = df.replace({np.nan: None})
    df.columns = df.columns.str.strip()

    datetime_cols = ['created_at', 'returned_at', 'shipped_at', 'delivered_at', 'sold_at']
    for col in datetime_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')

    print(f"📥 Loading {len(df)} rows into '{model_class.__tablename__}'...")

    failed_rows = []

    for index, row in df.iterrows():
        try:
            cleaned_row = clean_row_for_model(row, model_class)
            obj = model_class(**cleaned_row)
            db_session.add(obj)
        except Exception as e:
            print(f"❌ Error inserting row {index}: {e}")
            failed_rows.append(row.to_dict())

    try:
        db_session.commit()
        print(f"✅ All rows inserted into '{model_class.__tablename__}'")
    except Exception as e:
        db_session.rollback()
        print(f"❌ Commit failed: {e}")

    if failed_rows:
        error_file = f"errors_{model_class.__tablename__}.csv"
        pd.DataFrame(failed_rows).to_csv(error_file, index=False)
        print(f"⚠️ {len(failed_rows)} rows failed and were saved to {error_file}")


def main():
    # Create all tables
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Map models to CSV paths and optional column renaming
    csv_mapping = {
        models.User: ("data/users.csv", None),
        models.DistributionCenter: ("data/distribution_centers.csv", None),
        models.Product: ("data/products.csv", None),
        models.Order: ("data/orders.csv", None),
        models.InventoryItem: ("data/inventory_items.csv", None),
        models.OrderItem: ("data/order_items.csv", None),
    }

    for model, (path, mapping) in csv_mapping.items():
        if os.path.exists(path):
            load_csv_to_table(model, path, db, mapping)
        else:
            print(f"⚠️ File not found: {path}")

    db.close()
    print("✅ Done loading all data.")


if __name__ == "__main__":
    main()
