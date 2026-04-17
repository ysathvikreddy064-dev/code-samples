# lambda_function.py
import boto3
import csv
import io
import os
import logging
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')
BUCKET_NAME = os.environ.get('REPORT_BUCKET', 'trp-reports-prod')

def lambda_handler(event, context):
    try:
        records = event.get('records', [])
        if not records:
            logger.warning("No records provided in event payload.")
            return {'statusCode': 400, 'body': 'No records to export'}

        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=records[0].keys())
        writer.writeheader()
        writer.writerows(records)

        filename = f"reports/trade_export_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=filename,
            Body=output.getvalue().encode('utf-8'),
            ContentType='text/csv'
        )

        logger.info(f"Report uploaded successfully: s3://{BUCKET_NAME}/{filename}")
        return {'statusCode': 200, 'body': f'Report saved to {filename}'}

    except Exception as e:
        logger.error(f"Lambda execution failed: {str(e)}")
        return {'statusCode': 500, 'body': str(e)}
