import boto3

def create_table():
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')  # Change region as needed

    table = dynamodb.create_table(
        TableName='TowerScores',
        KeySchema=[
            {
                'AttributeName': 'TowerID',
                'KeyType': 'HASH'  # Partition key
            },
            {
                'AttributeName': 'Score',
                'KeyType': 'RANGE'  # Sort key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'TowerID',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'Score',
                'AttributeType': 'N'
            }
        ],
        BillingMode='PAY_PER_REQUEST'  # Or PROVISIONED with ReadCapacityUnits and WriteCapacityUnits
    )

    print("Table status:", table.table_status)

if __name__ == '__main__':
    create_table()