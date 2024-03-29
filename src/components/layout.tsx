import styled from "@emotion/styled"

export const LayoutContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  margin: 0;
  padding: 0;
`

interface LayoutItemProps {
  area: string
  scrollable?: boolean
}
export const LayoutItem = styled.div<LayoutItemProps>`
  grid-area: ${(props) => props.area};
  overflow: ${(props) => (props.scrollable === true ? "auto" : "hidden")};
`

export const Block = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
`
