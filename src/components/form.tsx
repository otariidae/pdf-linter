import { Fragment, type FC } from "react"

interface FilterFormProps {
  ruleIds: string[]
  muteIds: Set<string>
  soloIds: Set<string>
  toggleMute: (ruleId: string) => void
  toggleSolo: (ruleId: string) => void
}
const FilterForm: FC<FilterFormProps> = ({
  ruleIds,
  muteIds,
  soloIds,
  toggleMute,
  toggleSolo,
}) => (
  <Fragment>
    <p>Rules</p>
    <table>
      <thead>
        <tr>
          <th>Mute</th>
          <th>Solo</th>
          <th>Rule Name</th>
        </tr>
      </thead>
      <tbody>
        {ruleIds.map((ruleId) => (
          <tr key={ruleId}>
            <td>
              <input
                type="checkbox"
                title="Mute this rule"
                disabled={soloIds.size > 0}
                checked={muteIds.has(ruleId)}
                onChange={() => {
                  toggleMute(ruleId)
                }}
              />
            </td>
            <td>
              <input
                type="checkbox"
                title="Solo this rule"
                checked={soloIds.has(ruleId)}
                onChange={() => {
                  toggleSolo(ruleId)
                }}
              />
            </td>
            <td>{ruleId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Fragment>
)

export default FilterForm
