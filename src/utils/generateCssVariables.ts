type OptionalNullableString = string | null | undefined

const generateCssVariablesReducer = (acc: string[], [k, v]: [string, OptionalNullableString]) => {
  if (!v) return acc
  return [...acc, `--${k}: ${v}`]
}

const generateCssVariables = (variables: Record<string, OptionalNullableString>) =>
  Object.entries(variables).reduce(generateCssVariablesReducer, []).join('; ')

export default generateCssVariables
