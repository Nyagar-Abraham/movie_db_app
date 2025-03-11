import { useEffect, useState } from "react"

export const useFetch =<T>(fetchFunction:()=>Promise<T>,autofetch:boolean=true)=>{
  const [data,setData] = useState<T|null>(null)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState<Error | null>(null)

  const fetchData = async() => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchFunction()
      setData(data)
      
    } catch (error) {
      setError(error instanceof Error? error : new Error('An error occurred'))
      
    }finally{
      setLoading(false)
    }
  }

  const reset = ()=>{
    setData(null)
    setLoading(false)
    setError(null)
  }

  useEffect(()=> {
   if(autofetch){
    fetchData()
   }
  },[])

  return {data,loading,error,reset, reFetch:fetchData}
}

export default useFetch