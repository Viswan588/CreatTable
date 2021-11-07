const locationOptions = [
    {
        option: 'source', value: 'source'
    },
    {
        option: 'target', value: 'target'
    }
];

const tableLocationOptions = [
  {
      option: 'source', value: 'source'
  },
  {
      option: 'target', value: 'target'
  },
  {
      option: 'metaData management', value: 'metaData management'
  }
];

const tableRuleOptions = [
    {
        option: 'reference check', value: 'reference check'
    },
    {
        option: 'amount validation', value: 'amount validation'
    },
    {
        option: 'cusip check', value: 'cusip check'
    },
    {
        option: 'rating check', value: 'rating check'
    }
];

const dataTypes = [
    { option: 'int', value: 'int' },
    { option: 'boolean', value: 'boolean'  },
    { option: 'varchar', value: 'varchar'  },
    { option: 'float', value: 'float'  },
    { option: 'date', value: 'date'  },
  ];
  
  const dateFormatOpions = [
    {
      option: 'yyyy-MM-dd', value: 'yyyy-MM-dd'
    },
    {
      option: 'mm/dd/yyyy', value: 'mm/dd/yyyy'
    }
  ];

  const CREATE_TABLE_LABEL = 'Create Table';


  const ruleOptions = [
    { option: 'null check', value: 'null check' },
    { option: 'reference check', value: 'reference check' },
    { option: 'length check', value: 'length check' },
    { option: 'valid value check', value: 'valid value check' },
    { option: 'null check either or', value: 'null check either or' },
    { option: 'range Check', value: 'range Check' },
  ];



  const source_rulesObj = { 
    rule_name: 'null check'
  };

  const fieldObj =  {
    field_name: '',
    data_type: '',
    source_rules: []
  }

  const table_definition = {
    table_name: '',
    fields: []
  }

export {
    locationOptions, tableRuleOptions, dataTypes,
    CREATE_TABLE_LABEL, dateFormatOpions, ruleOptions,
    table_definition, fieldObj, source_rulesObj,
    tableLocationOptions
    };