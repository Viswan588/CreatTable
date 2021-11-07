const PMO_EDITS_COLUMNS=[
    {
        columnText: 'Fund Issuer Name',
        dbField: 'fund_issuer_name',
        type: 'text',
        readOnly: true
    },
    {
        columnText: 'Flights',
        dbField: 'flights',
        type: 'text',
        readOnly: true,
        width: 70
    },
    {
        columnText: 'Fund Cusip',
        dbField: 'fund_cusip',
        type: 'text',
        readOnly: true
    },
    {
        columnText: 'Fund Name',
        dbField: 'fund_name',
        type: 'text',
        readOnly: true,
        width: 300
    },
    {
        columnText: 'Asset Type',
        dbField: 'asset_type',
        type: 'text',
        readOnly: true
    },
    {
        columnText: 'Number of Holdings',
        dbField: 'number_of_holdings',
        type: 'text',
        readOnly: true,
        width: 130
    },
    {
        columnText: 'Market Value',
        dbField: 'market_value',
        type: 'text',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
        readOnly: true
    },
    {
        columnText: 'QA',
        dbField: 'qa',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
    },
    {
        columnText: 'NAV',
        dbField: 'nav',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
    },
    {
        columnText: 'Legal',
        dbField: 'legal',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
    },//,
    {
        columnText: 'Compliance',
        dbField: 'compliance',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
    },
    {
        columnText: 'Risk',
        dbField: 'risk',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,

    },
    {
        columnText: 'Treasury',
        dbField: 'treasury',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
    },
    {
        columnText: 'Reference Data',
        dbField: 'reference_data',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
    },
    {
        columnText: 'Market Data',
        dbField: 'market_data',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
    },//
    {
        columnText: 'Tax',
        dbField: 'tax',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
    },
    {
        columnText: 'KYC',
        dbField: 'kyc',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
    },
    {
        columnText: 'Conversion Percentage',
        dbField: 'conversion_percentage',
        type: 'number',
        redFlag: 50,
        amberMinValue: 50,
        amberMaxValue: 50,
        greenFlag: 50,
        width: 150,
        readOnly: true
    },
    {
        columnText: 'Fund Conversion Status',
        dbField: 'fund_conversion_status',
        type: 'text',
        readOnly: true
    },
    {
        columnText: 'Flight Start Date',
        dbField: 'flight_start_date',
        type: 'date'
    },
    {
        columnText: 'Flight End Date',
        dbField: 'flight_end_date',
        type: 'date'
    }
   
];

export default PMO_EDITS_COLUMNS;