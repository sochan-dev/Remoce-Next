import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { auth, db } from '../../../../firebase'
import { WorkPlace_data } from '../../../types/workPlace'

const useAuthentication = () => {
  const router = useRouter()
  const pathArray = router.pathname.split('/')
  const [authentication, setAuthentication] = useState(false)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid
        console.log('uid->', uid)
        if (pathArray[1] === 'office') {
          const officeId = router.query.office_id as string
          const employeeId = router.query.employee_id as string
          console.log(
            'officeId',
            officeId,
            'employeeId',
            employeeId,
            'uid',
            uid
          )
          db.collection('users')
            .doc(uid)
            .collection('employee_to_office')
            .doc(employeeId)
            .get()
            .then((snapshot) => {
              if (snapshot.exists) {
                const info = snapshot.data() as WorkPlace_data
                if (info.office_id !== officeId) {
                  router.push('/')
                }
              } else {
                router.push('/')
              }
            })
        }
      } else {
        router.push('/')
      }
    })

    setAuthentication(true)
  }, [])

  return authentication
}

export default useAuthentication
