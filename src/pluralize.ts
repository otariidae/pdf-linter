const pluralRules = new Intl.PluralRules("en")

export function pluralize(count: number, singular: string, plural: string) {
  const pluralCategory = pluralRules.select(count)
  switch (pluralCategory) {
    case "one":
      return singular
    default:
      return plural
  }
}
