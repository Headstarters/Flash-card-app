import React from 'react'
import { UserButton,useUser } from "@clerk/nextjs"
import { DotIcon } from '../icons/icons'
import { CancelSubscriptionPage } from './CancelSubscription'

export const UpdatedUserButton = () => {
    const {user,isLoaded} = useUser()
    const role = user?.publicMetadata['role']
  return (
    <UserButton>
          { role === 'pro' &&(
        <UserButton.UserProfilePage label="Cancel Subscription" url="cancel-subscription" labelIcon={<DotIcon/>}>
          <CancelSubscriptionPage/>
        </UserButton.UserProfilePage>
          )}
        </UserButton>
  )
}

