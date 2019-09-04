import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

import {
  Card,
  Menu,
  Pane,
  Popover,
  Position,
  Table,
  TextDropdownButton,
} from 'evergreen-ui'
import { useState } from 'react'
import { DayPickerRangeController } from 'react-dates'
import Paginate from 'react-paginate'
import { State } from 'react-powerplug'

import EventDialog from '../containers/EventDialog'

export const PAGE_SIZE = 20

export const normalizeEventType = eventType =>
  typeof eventType !== 'string' ? 'CAMERA_ALARM' : eventType

export const eventTypeToString = eventType => {
  switch (eventType) {
    case 'USER_LOGIN':
      return 'Erfolgreicher Benutzer Login'
    case 'USER_ADDED':
      return 'Benutzer erstellt'
    case 'USER_REMOVED':
      return 'Benutzer gelöscht'
    case 'USER_RESET_PASSWORD_MAIL':
      return 'eMail zum Passwort zurücksetzen verschickt'
    case 'USER_RESET_PASSWORD':
      return 'Passwort wurde geändert'
    case 'CAMERA_ADDED':
      return 'Kamera hinzugefügt'
    case 'CAMERA_UPDATED':
      return 'Kamera bearbeitet'
    case 'CAMERA_REMOVED':
      return 'Kamera entfernt'
    case 'CAMERA_HEALTH_CHECK_OFFLINE':
      return 'Kamera offline - Healthcheck fehlgeschlagen!'
    case 'CAMERA_HEALTH_CHECK_ONLINE':
      return 'Kamera wieder online - Healthcheck erfolgreich!'
    case 'CAMERA_SHOT':
      return 'Foto erstellt'
    case 'SWITCH_PLAN_FREE_PREMIUM':
      return 'Premium Abo abgeschlossen'
    case 'SWITCH_PLAN_PREMIUM_FREE':
      return 'Premium Abo gekündigt'
    case 'SWITCH_PLAN_PREMIUM_PREMIUM':
      return 'Zahlungsmethode gewechselt'
    case 'CAMERA_ALARM':
    default:
      return 'Bewegung erkannt'
  }
}

const EventHeaderCell = ({ value, onChange, children, icon }) => (
  <Table.HeaderCell>
    <Popover
      position={Position.BOTTOM_LEFT}
      content={({ close }) => (
        <Menu>
          <Menu.OptionsGroup
            title="Eventtyp"
            options={[
              { label: 'Alle anzeigen', value: 'all' },
              { label: 'Alarm', value: 'alarm' },
              { label: 'Account Events', value: 'account_events' },
              { label: 'Kamera Events', value: 'cam_events' },
            ]}
            selected={value}
            onChange={value => {
              onChange(value)
              // Close the popover when you select a value.
              close()
            }}
          />
        </Menu>
      )}
    >
      <Pane display="flex" alignItems="center">
        {value !== 'all' && (
          <Pane
            backgroundColor="#D9822B"
            borderRadius="50%"
            width=".4em"
            height=".4em"
            marginRight=".4em"
          />
        )}
        <TextDropdownButton icon={icon}>{children}</TextDropdownButton>
      </Pane>
    </Popover>
  </Table.HeaderCell>
)

const CameraHeaderCell = ({
  value,
  onChange,
  children,
  icon,
  cameras = [],
}) => (
  <Table.HeaderCell>
    <Popover
      position={Position.BOTTOM_LEFT}
      content={({ close }) => (
        <Menu>
          <Menu.OptionsGroup
            title="Kamera"
            options={[
              {
                label: 'Alle anzeigen',
                value: 'all',
              },
              ...cameras,
            ]}
            selected={value}
            onChange={value => {
              onChange(value)
              // Close the popover when you select a value.
              close()
            }}
          />
        </Menu>
      )}
    >
      <Pane display="flex" alignItems="center">
        {value !== 'all' && (
          <Pane
            backgroundColor="#D9822B"
            borderRadius="50%"
            width=".4em"
            height=".4em"
            marginRight=".4em"
          />
        )}
        <TextDropdownButton icon={icon}>{children}</TextDropdownButton>
      </Pane>
    </Popover>
  </Table.HeaderCell>
)

const TimeHeaderCell = ({ onChange, children, icon }) => {
  const [focusedInput, setFocus] = useState('startDate')
  const [{ startDate, endDate }, setDates] = useState({
    startDate: null,
    endDate: null,
  })
  return (
    <Table.HeaderCell>
      <Popover
        position={Position.BOTTOM_LEFT}
        content={({ close }) => (
          <DayPickerRangeController
            onDatesChange={({ startDate, endDate }) => {
              setDates({ startDate, endDate })
              if (startDate && endDate) {
                onChange({
                  fromDate: startDate.startOf('day').unix(),
                  toDate: endDate.endOf('day').unix(),
                })
                close()
              }
            }}
            focusedInput={focusedInput}
            minimumNights={0}
            onFocusChange={focus => setFocus(!focus ? 'startDate' : focus)}
            startDate={startDate}
            endDate={endDate}
            numberOfMonths={2}
            hideKeyboardShortcutsPanel
            isDayBlocked={date =>
              date.isAfter(new Date().toISOString()) ||
              date.isBefore(new Date(Date.now() - 2628e6).toISOString())
            }
          />
        )}
      >
        <Pane display="flex" alignItems="center">
          {startDate &&
            endDate && (
              <Pane
                backgroundColor="#D9822B"
                borderRadius="50%"
                width=".4em"
                height=".4em"
                marginRight=".4em"
              />
            )}
          <TextDropdownButton icon={icon}>{children}</TextDropdownButton>
        </Pane>
      </Popover>
    </Table.HeaderCell>
  )
}

export default ({
  events,
  disableCamName,
  totalEvents,
  fetchPage = () => {},
  options = {},
  refetch = () => {},
  page = 0,
  pageSize,
  cameras = [],
  ...props
}) => (
  <State initial={{ showDialog: false, eventId: null }}>
    {({ state: { showDialog, eventId }, setState }) => (
      <Card backgroundColor="white" padding="1em" {...props}>
        <Table>
          <Table.Head>
            <EventHeaderCell
              value={options.type}
              onChange={type => refetch({ ...options, type })}
            >
              Events
            </EventHeaderCell>
            <TimeHeaderCell
              onChange={dates => refetch({ ...options, ...dates })}
            >
              Zeitpunkt
            </TimeHeaderCell>
            {!disableCamName && (
              <CameraHeaderCell
                value={options.camera}
                cameras={cameras}
                onChange={camera => refetch({ ...options, camera })}
              >
                Kamera Name
              </CameraHeaderCell>
            )}
          </Table.Head>
          <Table.Body>
            {events.map(event => (
              <Table.Row
                key={event._id}
                isSelectable
                onSelect={() =>
                  setState({ showDialog: true, eventId: event._id })
                }
              >
                <Table.TextCell>{eventTypeToString(event.type)}</Table.TextCell>
                <Table.TextCell>
                  {new Date(parseInt(event.date)).toLocaleString()}
                </Table.TextCell>
                {!disableCamName && (
                  <Table.TextCell>
                    {event.cam ? event.cam.name : ''}
                  </Table.TextCell>
                )}
              </Table.Row>
            ))}
            <Table.Row>
              <Table.TextCell />
              {!disableCamName && <Table.TextCell />}
              <Table.TextCell>
                <style jsx global>{`
                  ul.pagination {
                    list-style-type: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                  }
                  ul.pagination > li {
                    margin: 0 0.2em;
                  }
                  ul.pagination > li > a:focus {
                    outline: none;
                  }
                  ul.pagination > li > a {
                    color: #1070ca;
                    cursor: pointer;
                  }
                  ul.pagination > li.selected > a {
                    font-weight: 900;
                  }
                  ul.pagination > li.disabled > a {
                    color: #aaa;
                    cursor: auto;
                  }
                `}</style>
                <Paginate
                  pageCount={
                    Math.ceil(totalEvents / (pageSize || PAGE_SIZE)) || 1
                  }
                  pageRangeDisplayed={5}
                  marginPagesDisplayed={2}
                  nextLabel="Nächste"
                  previousLabel="Zurück"
                  forcePage={page}
                  containerClassName="pagination"
                  onPageChange={({ selected }) => {
                    fetchPage(selected)
                  }}
                />
              </Table.TextCell>
            </Table.Row>
          </Table.Body>
        </Table>
        <EventDialog
          id={eventId}
          isShown={showDialog}
          onClose={() => setState({ showDialog: false })}
        />
      </Card>
    )}
  </State>
)
