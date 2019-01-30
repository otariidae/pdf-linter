import React, { ChangeEvent, Component } from "react"
import { onFileInput, onLintFinished } from "../actions"
import { lintPDFFile } from "../pdf"
import { connect } from "react-redux"
import { LintResult } from "../type"

type FormProp = {
  onFileInput: (obj: { file: File }) => any
  onLintFinished: (obj: { lintResults: LintResult }) => any
}

class Form extends Component<FormProp> {
  constructor(props: FormProp) {
    super(props)
    this.onFileInput = this.onFileInput.bind(this)
  }
  private async onFileInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files[0]
    this.props.onFileInput({ file })
    const lintResults = await lintPDFFile(file)
    this.props.onLintFinished({ lintResults })
  }
  render() {
    return (
      <input type="file" accept="application/pdf" onChange={this.onFileInput} />
    )
  }
}

const mapDispatchToProps = {
  onFileInput,
  onLintFinished
}

export default connect(
  null,
  mapDispatchToProps
)(Form)
