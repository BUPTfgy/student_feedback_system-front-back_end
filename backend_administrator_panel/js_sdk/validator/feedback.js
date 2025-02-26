// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "name": {
    "rules": [
      {
        "required": true,
        "errorMessage": "姓名不能为空"
      },
      {
        "format": "string"
      },
      {
        "minLength": 1,
        "maxLength": 20,
        "errorMessage": "姓名长度不能小于1个字符"
      }
    ],
    "title": "姓名",
    "label": "姓名"
  },
  "contact": {
    "rules": [
      {
        "required": true,
        "errorMessage": "联系方式不能为空"
      },
      {
        "format": "string"
      },
      {
        "format": "email|phone",
        "errorMessage": "请输入有效的邮箱或手机号"
      }
    ],
    "title": "联系方式",
    "label": "联系方式"
  },
  "content": {
    "rules": [
      {
        "required": true,
        "errorMessage": "反馈内容不能为空"
      },
      {
        "format": "string"
      },
      {
        "minLength": 10,
        "maxLength": 500,
        "errorMessage": "反馈内容长度不能小于10个字符"
      }
    ],
    "title": "反馈内容",
    "label": "反馈内容"
  },
  "create_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "创建时间",
    "defaultValue": {
      "$env": "now"
    },
    "label": "创建时间"
  }
}

const enumConverter = {}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
