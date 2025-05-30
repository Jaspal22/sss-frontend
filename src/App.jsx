import { Route, Routes } from 'react-router-dom';
import './App.css'
import TimeTableFormat from './components/teachersTimetable'
import ViewTimeTable from './pages/homePage'
import { Toaster } from 'react-hot-toast';
import UploadMarks from './components/PT_I_Components/uploadMarks';
import ZeroHome from './components/zeroHome';
import InchargesPage from './components/PT_I_Components/InchargesPage';
import PrintCards from './components/PT_I_Components/PrintCards';


function App() {
  console.log(import.meta.env.VITE_BACKEND_URL);

  return (
    <>
    <Routes>
      <Route path='/' element={<ViewTimeTable />} />
      <Route path='/uploadmarks' element={<UploadMarks />} />
      <Route path='/incharges-page' element={<InchargesPage />} />
      <Route path='/PrintCards' element={<PrintCards />} />
    </Routes>
     <Toaster />
      <div className='w-full flex justify-center items-center'>
          {/* <ViewTimeTable /> */}
      </div>
    </>
    
    
  )
}

export default App
