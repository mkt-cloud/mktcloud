import { Card, Heading, Pane } from 'evergreen-ui'
import gql from 'graphql-tag'
import React from 'react'

import Cam from '../containers/Cam'
import redirect from '../lib/redirect'

export default class BigPlayer extends React.Component {
  state = { active: 0 }
  render() {
    return (
      <Pane display="grid" gridTemplateColumns="3fr 1fr">
        <Card background="#000" overflow="hidden">
          <Cam
            hideDetail
            id={this.props.cameras[this.state.active]._id}
            onSettingsIconClick={() =>
              redirect({}, `/cam/${this.props.cameras[this.state.active]._id}`)
            }
            onShotIconClick={() =>
              this.props.client.query({
                query: gql`
                  query getCamArea($id: ID!) {
                    camera(_id: $id) {
                      _id
                      takeSnap
                    }
                  }
                `,
                fetchPolicy: 'network-only',
                variables: {
                  id: this.props.cameras[this.state.active]._id,
                },
              })
            }
          />
        </Card>
        <Card
          background="#fff"
          marginLeft="1em"
          paddingY=".5em"
          overflow="auto"
        >
          {this.props.cameras.map((cam, i) => (
            <Pane
              paddingX="2em"
              paddingY="1em"
              key={cam._id}
              backgroundColor={i === this.state.active ? '#f5f5f5' : '#fff'}
              borderBottom={
                i === this.state.active || i === this.state.active - 1
                  ? '1px solid #1070ca'
                  : '1px solid #dfdfdf'
              }
              borderTop={
                i === 0 &&
                (i === this.state.active
                  ? '1px solid #1070ca'
                  : '1px solid #dfdfdf')
              }
              width="100%"
              onClick={() => this.setState({ active: i })}
              cursor="pointer"
            >
              <Heading color={i === this.state.active && '#1070ca'} size={600}>
                {cam.name}
              </Heading>
              <Heading color={i === this.state.active && '#1070ca'}>
                {cam.model}
              </Heading>
            </Pane>
          ))}
        </Card>
      </Pane>
    )
  }
}
