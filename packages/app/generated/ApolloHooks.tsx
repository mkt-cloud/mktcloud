import gql from 'graphql-tag'
import * as ApolloReactCommon from '@apollo/react-common'
import * as ApolloReactHooks from '@apollo/react-hooks'
export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** Represents a (long) integer in a binary string */
  BitMap: any
  /** Represents a (long) integer in a binary string (48) */
  BitMap48: any
  /** Represents a (long) integer in a binary string (10) */
  BitMap10: any
}

export type Camera = {
  __typename?: 'Camera'
  _id: Scalars['ID']
  owner: User
  name?: Maybe<Scalars['String']>
  model?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  usr?: Maybe<Scalars['String']>
  pwd?: Maybe<Scalars['String']>
  http?: Maybe<Scalars['Int']>
  rtsp?: Maybe<Scalars['Int']>
  liveUrl?: Maybe<Scalars['String']>
  timeZone?: Maybe<Scalars['Int']>
  ftpUser?: Maybe<Scalars['String']>
  ftpPass?: Maybe<Scalars['String']>
  status: Status
  getMotionDetectConfig?: Maybe<MotionDetectConfig>
  takeSnap?: Maybe<Scalars['String']>
  events: EventsPage
}

export type CameraEventsArgs = {
  options?: Maybe<EventOptions>
}

export enum Db_Event {
  Added = 'ADDED',
  Updated = 'UPDATED',
  Removed = 'REMOVED',
}

export type Event = {
  __typename?: 'Event'
  _id: Scalars['ID']
  path?: Maybe<Scalars['String']>
  date: Scalars['String']
  cam?: Maybe<Camera>
  type?: Maybe<Scalars['String']>
  owner: User
  download?: Maybe<Scalars['String']>
}

export type EventOptions = {
  skip?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
  type?: Maybe<Array<Maybe<Scalars['String']>>>
  fromDate?: Maybe<Scalars['Int']>
  toDate?: Maybe<Scalars['Int']>
  device?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type EventsPage = {
  __typename?: 'EventsPage'
  total: Scalars['Int']
  data: Array<Event>
}

export type MotionDetectConfig = {
  __typename?: 'MotionDetectConfig'
  result: Scalars['Int']
  isEnable?: Maybe<Scalars['Int']>
  linkage?: Maybe<Scalars['BitMap']>
  snapInterval?: Maybe<Scalars['Int']>
  sensitivity?: Maybe<Scalars['Int']>
  triggerInterval?: Maybe<Scalars['Int']>
  schedule0?: Maybe<Scalars['BitMap48']>
  schedule1?: Maybe<Scalars['BitMap48']>
  schedule2?: Maybe<Scalars['BitMap48']>
  schedule3?: Maybe<Scalars['BitMap48']>
  schedule4?: Maybe<Scalars['BitMap48']>
  schedule5?: Maybe<Scalars['BitMap48']>
  schedule6?: Maybe<Scalars['BitMap48']>
  area0?: Maybe<Scalars['BitMap10']>
  area1?: Maybe<Scalars['BitMap10']>
  area2?: Maybe<Scalars['BitMap10']>
  area3?: Maybe<Scalars['BitMap10']>
  area4?: Maybe<Scalars['BitMap10']>
  area5?: Maybe<Scalars['BitMap10']>
  area6?: Maybe<Scalars['BitMap10']>
  area7?: Maybe<Scalars['BitMap10']>
  area8?: Maybe<Scalars['BitMap10']>
  area9?: Maybe<Scalars['BitMap10']>
}

export type MotionDetectConfigInput = {
  isEnable?: Maybe<Scalars['Int']>
  linkage?: Maybe<Scalars['BitMap']>
  snapInterval?: Maybe<Scalars['Int']>
  sensitivity?: Maybe<Scalars['Int']>
  triggerInterval?: Maybe<Scalars['Int']>
  isMovAlarmEnable?: Maybe<Scalars['Int']>
  isPirAlarmEnable?: Maybe<Scalars['Int']>
  schedule0?: Maybe<Scalars['BitMap']>
  schedule1?: Maybe<Scalars['BitMap']>
  schedule2?: Maybe<Scalars['BitMap']>
  schedule3?: Maybe<Scalars['BitMap']>
  schedule4?: Maybe<Scalars['BitMap']>
  schedule5?: Maybe<Scalars['BitMap']>
  schedule6?: Maybe<Scalars['BitMap']>
  area0?: Maybe<Scalars['BitMap']>
  area1?: Maybe<Scalars['BitMap']>
  area2?: Maybe<Scalars['BitMap']>
  area3?: Maybe<Scalars['BitMap']>
  area4?: Maybe<Scalars['BitMap']>
  area5?: Maybe<Scalars['BitMap']>
  area6?: Maybe<Scalars['BitMap']>
  area7?: Maybe<Scalars['BitMap']>
  area8?: Maybe<Scalars['BitMap']>
  area9?: Maybe<Scalars['BitMap']>
}

export type Mutation = {
  __typename?: 'Mutation'
  addCamera?: Maybe<Camera>
  updateCamera?: Maybe<Camera>
  removeCamera?: Maybe<Camera>
  login?: Maybe<Token>
  resetPassword?: Maybe<Status>
  setPassword?: Maybe<User>
  addUser?: Maybe<User>
  updateUser?: Maybe<User>
  removeUser?: Maybe<User>
  updateMe?: Maybe<User>
  removeMe?: Maybe<User>
  switchPlan?: Maybe<User>
  refreshToken?: Maybe<Token>
}

export type MutationAddCameraArgs = {
  name: Scalars['String']
  model: Scalars['String']
  address: Scalars['String']
  http: Scalars['Int']
  rtsp?: Maybe<Scalars['Int']>
  usr: Scalars['String']
  pwd: Scalars['String']
}

export type MutationUpdateCameraArgs = {
  _id: Scalars['ID']
  owner?: Maybe<Scalars['ID']>
  name?: Maybe<Scalars['String']>
  model?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  http?: Maybe<Scalars['Int']>
  rtsp?: Maybe<Scalars['Int']>
  usr?: Maybe<Scalars['String']>
  pwd?: Maybe<Scalars['String']>
  setMotionDetectConfig?: Maybe<MotionDetectConfigInput>
  ptzMove?: Maybe<PtzMove>
}

export type MutationRemoveCameraArgs = {
  _id: Scalars['ID']
}

export type MutationLoginArgs = {
  email: Scalars['String']
  password: Scalars['String']
  token?: Maybe<Scalars['String']>
}

export type MutationResetPasswordArgs = {
  email: Scalars['String']
}

export type MutationSetPasswordArgs = {
  token: Scalars['String']
  newPassword: Scalars['String']
}

export type MutationAddUserArgs = {
  firstName: Scalars['String']
  lastName: Scalars['String']
  email: Scalars['String']
  password: Scalars['String']
}

export type MutationUpdateUserArgs = {
  _id: Scalars['ID']
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type MutationRemoveUserArgs = {
  _id: Scalars['ID']
}

export type MutationUpdateMeArgs = {
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type MutationSwitchPlanArgs = {
  plan: Plan
  nonce?: Maybe<Scalars['String']>
}

export enum Plan {
  Premium = 'PREMIUM',
  Free = 'FREE',
}

export enum PtzMove {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
  Upleft = 'UPLEFT',
  Upright = 'UPRIGHT',
  Downleft = 'DOWNLEFT',
  Downright = 'DOWNRIGHT',
  Reset = 'RESET',
}

export type Query = {
  __typename?: 'Query'
  cameras?: Maybe<Array<Maybe<Camera>>>
  camera?: Maybe<Camera>
  users?: Maybe<Array<Maybe<User>>>
  user?: Maybe<User>
  me?: Maybe<User>
  event?: Maybe<Event>
}

export type QueryCameraArgs = {
  _id: Scalars['ID']
}

export type QueryUserArgs = {
  _id: Scalars['ID']
}

export type QueryEventArgs = {
  _id: Scalars['ID']
}

export enum Status {
  Default = 'DEFAULT',
  Success = 'SUCCESS',
  Deleted = 'DELETED',
  Error = 'ERROR',
}

export type Subscription = {
  __typename?: 'Subscription'
  camera?: Maybe<Camera>
  user?: Maybe<User>
  me?: Maybe<User>
  refreshedToken?: Maybe<Token>
}

export type SubscriptionCameraArgs = {
  events: Array<Db_Event>
}

export type SubscriptionUserArgs = {
  events: Array<Db_Event>
}

export type SubscriptionMeArgs = {
  events: Array<Db_Event>
}

export type Token = {
  __typename?: 'Token'
  status: Status
  token?: Maybe<Scalars['String']>
  owner?: Maybe<User>
}

export type User = {
  __typename?: 'User'
  _id: Scalars['ID']
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  email: Scalars['String']
  cameras?: Maybe<Array<Maybe<Camera>>>
  clientToken?: Maybe<Scalars['String']>
  status: Status
  plan: Plan
  events: EventsPage
}

export type UserEventsArgs = {
  options?: Maybe<EventOptions>
}
export type LoginMutationVariables = {
  email: Scalars['String']
  password: Scalars['String']
}

export type LoginMutation = { __typename?: 'Mutation' } & {
  login: Maybe<
    { __typename?: 'Token' } & Pick<Token, 'status' | 'token'> & {
        owner: Maybe<
          { __typename?: 'User' } & Pick<
            User,
            'firstName' | 'lastName' | 'plan'
          >
        >
      }
  >
}

export type RegisterMutationVariables = {
  firstName: Scalars['String']
  lastName: Scalars['String']
  email: Scalars['String']
  password: Scalars['String']
}

export type RegisterMutation = { __typename?: 'Mutation' } & {
  addUser: Maybe<{ __typename?: 'User' } & Pick<User, '_id' | 'status'>>
}

export type GetEventQueryVariables = {
  id: Scalars['ID']
}

export type GetEventQuery = { __typename?: 'Query' } & {
  event: Maybe<
    { __typename?: 'Event' } & Pick<Event, '_id' | 'date' | 'type' | 'download'>
  >
}

export type AllEventsQueryVariables = {
  skip: Scalars['Int']
  limit: Scalars['Int']
  device?: Maybe<Array<Maybe<Scalars['String']>>>
  type?: Maybe<Array<Maybe<Scalars['String']>>>
  fromDate?: Maybe<Scalars['Int']>
  toDate?: Maybe<Scalars['Int']>
}

export type AllEventsQuery = { __typename?: 'Query' } & {
  me: Maybe<
    { __typename?: 'User' } & Pick<
      User,
      '_id' | 'firstName' | 'lastName' | 'email' | 'plan'
    > & {
        events: { __typename?: 'EventsPage' } & Pick<EventsPage, 'total'> & {
            data: Array<
              { __typename?: 'Event' } & Pick<
                Event,
                '_id' | 'date' | 'type'
              > & {
                  cam: Maybe<
                    { __typename?: 'Camera' } & Pick<Camera, 'name' | 'model'>
                  >
                }
            >
          }
      }
  >
}

export type UpdateMeMutationVariables = {
  firstName: Scalars['String']
  lastName: Scalars['String']
  email: Scalars['String']
}

export type UpdateMeMutation = { __typename?: 'Mutation' } & {
  updateMe: Maybe<
    { __typename?: 'User' } & Pick<
      User,
      '_id' | 'firstName' | 'lastName' | 'email'
    >
  >
}

export type MeQueryVariables = {}

export type MeQuery = { __typename?: 'Query' } & {
  me: Maybe<
    { __typename?: 'User' } & Pick<
      User,
      '_id' | 'firstName' | 'lastName' | 'email' | 'plan'
    > & {
        cameras: Maybe<
          Array<Maybe<{ __typename?: 'Camera' } & Pick<Camera, '_id' | 'name'>>>
        >
      }
  >
}

export type AddCameraMutationVariables = {
  name: Scalars['String']
  model: Scalars['String']
  address: Scalars['String']
  http: Scalars['Int']
  rtsp: Scalars['Int']
  usr: Scalars['String']
  pwd: Scalars['String']
}

export type AddCameraMutation = { __typename?: 'Mutation' } & {
  addCamera: Maybe<
    { __typename?: 'Camera' } & Pick<
      Camera,
      '_id' | 'name' | 'model' | 'liveUrl'
    >
  >
}

export type EditCameraMutationVariables = {
  id: Scalars['ID']
  name: Scalars['String']
  model: Scalars['String']
  address: Scalars['String']
  http: Scalars['Int']
  rtsp: Scalars['Int']
  usr: Scalars['String']
  pwd: Scalars['String']
}

export type EditCameraMutation = { __typename?: 'Mutation' } & {
  updateCamera: Maybe<
    { __typename?: 'Camera' } & Pick<
      Camera,
      '_id' | 'name' | 'model' | 'address' | 'http' | 'rtsp' | 'usr' | 'liveUrl'
    >
  >
}

export type RemoveCameraMutationVariables = {
  id: Scalars['ID']
}

export type RemoveCameraMutation = { __typename?: 'Mutation' } & {
  removeCamera: Maybe<{ __typename?: 'Camera' } & Pick<Camera, '_id'>>
}

export type GetCameraQueryVariables = {
  id: Scalars['ID']
}

export type GetCameraQuery = { __typename?: 'Query' } & {
  camera: Maybe<
    { __typename?: 'Camera' } & Pick<
      Camera,
      '_id' | 'name' | 'model' | 'address' | 'usr' | 'http' | 'rtsp' | 'liveUrl'
    >
  >
}

export type AllCamerasQueryVariables = {}

export type AllCamerasQuery = { __typename?: 'Query' } & {
  me: Maybe<
    { __typename?: 'User' } & Pick<
      User,
      '_id' | 'firstName' | 'lastName' | 'email' | 'plan'
    > & {
        cameras: Maybe<
          Array<
            Maybe<
              { __typename?: 'Camera' } & Pick<Camera, '_id' | 'name' | 'model'>
            >
          >
        >
      }
  >
}

export type AllCamerasLiveUrlQueryVariables = {}

export type AllCamerasLiveUrlQuery = { __typename?: 'Query' } & {
  me: Maybe<
    { __typename?: 'User' } & Pick<User, '_id'> & {
        cameras: Maybe<
          Array<
            Maybe<{ __typename?: 'Camera' } & Pick<Camera, '_id' | 'liveUrl'>>
          >
        >
      }
  >
}

export const LoginDocument = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      status
      token
      owner {
        firstName
        lastName
        plan
      }
    }
  }
`
export type LoginMutationFn = ApolloReactCommon.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>

export function useLoginMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    baseOptions,
  )
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>
export type LoginMutationResult = ApolloReactCommon.MutationResult<
  LoginMutation
>
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>
export const RegisterDocument = gql`
  mutation Register(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      _id
      status
    }
  }
`
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>

export function useRegisterMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    RegisterMutation,
    RegisterMutationVariables
  >(RegisterDocument, baseOptions)
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>
export type RegisterMutationResult = ApolloReactCommon.MutationResult<
  RegisterMutation
>
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>
export const GetEventDocument = gql`
  query getEvent($id: ID!) {
    event(_id: $id) {
      _id
      date
      type
      download
    }
  }
`

export function useGetEventQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetEventQuery,
    GetEventQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<GetEventQuery, GetEventQueryVariables>(
    GetEventDocument,
    baseOptions,
  )
}
export type GetEventQueryHookResult = ReturnType<typeof useGetEventQuery>
export type GetEventQueryResult = ApolloReactCommon.QueryResult<
  GetEventQuery,
  GetEventQueryVariables
>
export const AllEventsDocument = gql`
  query AllEvents(
    $skip: Int!
    $limit: Int!
    $device: [String]
    $type: [String]
    $fromDate: Int
    $toDate: Int
  ) {
    me {
      _id
      firstName
      lastName
      email
      plan
      events(
        options: {
          skip: $skip
          limit: $limit
          device: $device
          type: $type
          fromDate: $fromDate
          toDate: $toDate
        }
      ) {
        total
        data {
          _id
          date
          type
          cam {
            name
            model
          }
        }
      }
    }
  }
`

export function useAllEventsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AllEventsQuery,
    AllEventsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<AllEventsQuery, AllEventsQueryVariables>(
    AllEventsDocument,
    baseOptions,
  )
}
export type AllEventsQueryHookResult = ReturnType<typeof useAllEventsQuery>
export type AllEventsQueryResult = ApolloReactCommon.QueryResult<
  AllEventsQuery,
  AllEventsQueryVariables
>
export const UpdateMeDocument = gql`
  mutation UpdateMe($firstName: String!, $lastName: String!, $email: String!) {
    updateMe(firstName: $firstName, lastName: $lastName, email: $email) {
      _id
      firstName
      lastName
      email
    }
  }
`
export type UpdateMeMutationFn = ApolloReactCommon.MutationFunction<
  UpdateMeMutation,
  UpdateMeMutationVariables
>

export function useUpdateMeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateMeMutation,
    UpdateMeMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateMeMutation,
    UpdateMeMutationVariables
  >(UpdateMeDocument, baseOptions)
}
export type UpdateMeMutationHookResult = ReturnType<typeof useUpdateMeMutation>
export type UpdateMeMutationResult = ApolloReactCommon.MutationResult<
  UpdateMeMutation
>
export type UpdateMeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateMeMutation,
  UpdateMeMutationVariables
>
export const MeDocument = gql`
  query Me {
    me {
      _id
      firstName
      lastName
      email
      plan
      cameras {
        _id
        name
      }
    }
  }
`

export function useMeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>,
) {
  return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(
    MeDocument,
    baseOptions,
  )
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>
export type MeQueryResult = ApolloReactCommon.QueryResult<
  MeQuery,
  MeQueryVariables
>
export const AddCameraDocument = gql`
  mutation AddCamera(
    $name: String!
    $model: String!
    $address: String!
    $http: Int!
    $rtsp: Int!
    $usr: String!
    $pwd: String!
  ) {
    addCamera(
      name: $name
      model: $model
      address: $address
      http: $http
      rtsp: $rtsp
      usr: $usr
      pwd: $pwd
    ) {
      _id
      name
      model
      liveUrl
    }
  }
`
export type AddCameraMutationFn = ApolloReactCommon.MutationFunction<
  AddCameraMutation,
  AddCameraMutationVariables
>

export function useAddCameraMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddCameraMutation,
    AddCameraMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    AddCameraMutation,
    AddCameraMutationVariables
  >(AddCameraDocument, baseOptions)
}
export type AddCameraMutationHookResult = ReturnType<
  typeof useAddCameraMutation
>
export type AddCameraMutationResult = ApolloReactCommon.MutationResult<
  AddCameraMutation
>
export type AddCameraMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddCameraMutation,
  AddCameraMutationVariables
>
export const EditCameraDocument = gql`
  mutation EditCamera(
    $id: ID!
    $name: String!
    $model: String!
    $address: String!
    $http: Int!
    $rtsp: Int!
    $usr: String!
    $pwd: String!
  ) {
    updateCamera(
      _id: $id
      name: $name
      model: $model
      address: $address
      http: $http
      rtsp: $rtsp
      usr: $usr
      pwd: $pwd
    ) {
      _id
      name
      model
      address
      http
      rtsp
      usr
      liveUrl
    }
  }
`
export type EditCameraMutationFn = ApolloReactCommon.MutationFunction<
  EditCameraMutation,
  EditCameraMutationVariables
>

export function useEditCameraMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    EditCameraMutation,
    EditCameraMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    EditCameraMutation,
    EditCameraMutationVariables
  >(EditCameraDocument, baseOptions)
}
export type EditCameraMutationHookResult = ReturnType<
  typeof useEditCameraMutation
>
export type EditCameraMutationResult = ApolloReactCommon.MutationResult<
  EditCameraMutation
>
export type EditCameraMutationOptions = ApolloReactCommon.BaseMutationOptions<
  EditCameraMutation,
  EditCameraMutationVariables
>
export const RemoveCameraDocument = gql`
  mutation RemoveCamera($id: ID!) {
    removeCamera(_id: $id) {
      _id
    }
  }
`
export type RemoveCameraMutationFn = ApolloReactCommon.MutationFunction<
  RemoveCameraMutation,
  RemoveCameraMutationVariables
>

export function useRemoveCameraMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemoveCameraMutation,
    RemoveCameraMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    RemoveCameraMutation,
    RemoveCameraMutationVariables
  >(RemoveCameraDocument, baseOptions)
}
export type RemoveCameraMutationHookResult = ReturnType<
  typeof useRemoveCameraMutation
>
export type RemoveCameraMutationResult = ApolloReactCommon.MutationResult<
  RemoveCameraMutation
>
export type RemoveCameraMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RemoveCameraMutation,
  RemoveCameraMutationVariables
>
export const GetCameraDocument = gql`
  query getCamera($id: ID!) {
    camera(_id: $id) {
      _id
      name
      model
      address
      usr
      http
      rtsp
      liveUrl
    }
  }
`

export function useGetCameraQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetCameraQuery,
    GetCameraQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<GetCameraQuery, GetCameraQueryVariables>(
    GetCameraDocument,
    baseOptions,
  )
}
export type GetCameraQueryHookResult = ReturnType<typeof useGetCameraQuery>
export type GetCameraQueryResult = ApolloReactCommon.QueryResult<
  GetCameraQuery,
  GetCameraQueryVariables
>
export const AllCamerasDocument = gql`
  query AllCameras {
    me {
      _id
      firstName
      lastName
      email
      plan
      cameras {
        _id
        name
        model
      }
    }
  }
`

export function useAllCamerasQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AllCamerasQuery,
    AllCamerasQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<AllCamerasQuery, AllCamerasQueryVariables>(
    AllCamerasDocument,
    baseOptions,
  )
}
export type AllCamerasQueryHookResult = ReturnType<typeof useAllCamerasQuery>
export type AllCamerasQueryResult = ApolloReactCommon.QueryResult<
  AllCamerasQuery,
  AllCamerasQueryVariables
>
export const AllCamerasLiveUrlDocument = gql`
  query AllCamerasLiveUrl {
    me {
      _id
      cameras {
        _id
        liveUrl
      }
    }
  }
`

export function useAllCamerasLiveUrlQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AllCamerasLiveUrlQuery,
    AllCamerasLiveUrlQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    AllCamerasLiveUrlQuery,
    AllCamerasLiveUrlQueryVariables
  >(AllCamerasLiveUrlDocument, baseOptions)
}
export type AllCamerasLiveUrlQueryHookResult = ReturnType<
  typeof useAllCamerasLiveUrlQuery
>
export type AllCamerasLiveUrlQueryResult = ApolloReactCommon.QueryResult<
  AllCamerasLiveUrlQuery,
  AllCamerasLiveUrlQueryVariables
>
