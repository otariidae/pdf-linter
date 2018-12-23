import React, { Fragment, memo, FunctionComponent } from "react"
import { LintResult } from "../type"

interface LintResultViewerProp {
  lintResults: LintResult
}

const LintResultViewer: FunctionComponent<LintResultViewerProp> = memo(
  ({ lintResults }) => (
    <Fragment>
      {lintResults.map((result, i) => (
        <Fragment key={i}>
          <p>ページ {i + 1}</p>
          <ul>
            {result.map((item, i) => (
              <li key={i}>
                行: {item.line} 列: {item.column}: {item.message}
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </Fragment>
  )
)

export default LintResultViewer
