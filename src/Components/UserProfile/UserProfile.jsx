import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './UserProfile.css';
import { getAuth, updatePassword, deleteUser } from 'firebase/auth';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { updateUser } from '../../ReduxToolkit/userSlice';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [editableUser, setEditableUser] = useState({
    name: user.name || '',
    email: user.email || '',
    password: '********',
    phone: user.phone || '',
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false,
    phone: false,
    photo: false,
  });

  const [profilePhoto, setProfilePhoto] = useState(user.photoUrl || '');
  const [actaPhoto, setActaPhoto] = useState(null);
  const [actaFileName, setActaFileName] = useState('');
  const [acta3DPhoto, setActa3DPhoto] = useState(null);
  const [acta3DFileName, setActa3DFileName] = useState('');
  const [newPhoto, setNewPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isCompany, setIsCompany] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [companyData, setCompanyData] = useState({
    companyName: '',
    location: '',
    cbu: '',
    actaPhoto: '',
    serviceFee: '',
    status: 'pending',
  });
  const [company3DData, setCompany3DData] = useState({
    companyName: '',
    location: '',
    cbu: '',
    actaPhoto: '',
    serviceFee: '',
    status: 'pending',
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]); // Para solicitudes aprobadas
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBusiness, setIsBusiness] = useState(user.isBusiness || false);
  const [loading, setLoading] = useState(true); // Manejar estado de carga

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      getDoc(userRef).then((doc) => {
        if (doc.exists()) {
          setProfilePhoto(doc.data().photoUrl || '');
          setIsBusiness(doc.data().isBusiness || false);

          if (!doc.data().hasOwnProperty('isBusiness')) {
            updateDoc(userRef, { isBusiness: false });
          }

          if (doc.data().role === 'ADMIN') {
            setIsAdmin(true);
            loadPendingRequests();
            loadApprovedRequests(); // Cargar también las solicitudes aprobadas
          }

          setLoading(false); // Cambiar a false cuando la información esté lista
        }
      });
    }
  }, [currentUser]);

  const loadPendingRequests = async () => {
    const q = query(collection(db, 'users'), where('companyData.status', 'in', ['pending', 'pending removal']));
    const querySnapshot = await getDocs(q);
    const pendingRequestsArray = [];
    querySnapshot.forEach((doc) => {
      pendingRequestsArray.push({ id: doc.id, ...doc.data() });
    });
    setPendingRequests(pendingRequestsArray);
  };

  const loadApprovedRequests = async () => {
    const q = query(collection(db, 'users'), where('companyData.status', '==', 'approved'));
    const querySnapshot = await getDocs(q);
    const approvedRequestsArray = [];
    querySnapshot.forEach((doc) => {
      approvedRequestsArray.push({ id: doc.id, ...doc.data() });
    });
    setApprovedRequests(approvedRequestsArray);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  const handleNameChange = () => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, { name: editableUser.name })
        .then(() => {
          setMessage('Nombre actualizado exitosamente');
          dispatch(updateUser({ name: editableUser.name }));
          setIsEditing({ ...isEditing, name: false });
          setTimeout(() => setMessage(''), 3000);
        })
        .catch((error) => {
          console.error('Error al actualizar el nombre:', error);
          alert('Error al actualizar el nombre');
        });
    }
  };

  const handlePasswordChange = () => {
    if (currentUser) {
      updatePassword(currentUser, editableUser.password)
        .then(() => {
          setMessage('Contraseña modificada exitosamente');
          setIsEditing({ ...isEditing, password: false });
          setTimeout(() => setMessage(''), 3000);
        })
        .catch((error) => {
          console.error('Error al modificar la contraseña:', error);
          alert(`Error al modificar la contraseña: ${error.message}`);
        });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleActaPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setActaPhoto(file);
      setActaFileName(file.name);
    }
  };

  const handleActa3DPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setActa3DPhoto(file);
      setActa3DFileName(file.name);
    }
  };

  const handlePhotoSave = () => {
    if (newPhoto && currentUser) {
      const storageRef = ref(storage, `profilePhotos/${currentUser.uid}`);
      uploadBytes(storageRef, newPhoto)
        .then(() => {
          getDownloadURL(storageRef).then((url) => {
            const userRef = doc(db, 'users', currentUser.uid);
            updateDoc(userRef, { photoUrl: url })
              .then(() => {
                setProfilePhoto(url);
                setMessage('Imagen cargada exitosamente');
                setTimeout(() => setMessage(''), 3000);
              })
              .catch((error) => {
                console.error('Error al guardar la foto en la base de datos:', error);
                alert('Error al guardar la foto en la base de datos');
              });
          });
        })
        .catch((error) => {
          console.error('Error al cargar la foto en Firebase Storage:', error);
          alert('Error al cargar la foto');
        });
    }
  };

  const handlePhotoDelete = () => {
    if (profilePhoto && currentUser) {
      const storageRef = ref(storage, `profilePhotos/${currentUser.uid}`);
      deleteObject(storageRef)
        .then(() => {
          const userRef = doc(db, 'users', currentUser.uid);
          updateDoc(userRef, { photoUrl: '' })
            .then(() => {
              setProfilePhoto('');
              setMessage('Foto eliminada exitosamente');
              setTimeout(() => setMessage(''), 3000);
            })
            .catch((error) => {
              console.error('Error al eliminar la foto de la base de datos:', error);
              alert('Error al eliminar la foto de la base de datos');
            });
        })
        .catch((error) => {
          console.error('Error al eliminar la foto en Firebase Storage:', error);
          alert('Error al eliminar la foto en Firebase Storage');
        });
    }
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta?');
    if (confirmDelete) {
      deleteUser(currentUser)
        .then(() => {
          alert('Cuenta eliminada exitosamente');
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('Error al eliminar la cuenta:', error);
          alert('Error al eliminar la cuenta');
        });
    }
  };

  const toggleEditing = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleApprove = async (id) => {
    const userRef = doc(db, 'users', id);
    const userDoc = await getDoc(userRef);

    // Revisar si es una aprobación para ser empresa o para dejar de ser empresa
    if (userDoc.exists() && userDoc.data().companyData.status === 'pending removal') {
      await updateDoc(userRef, {
        isBusiness: false,
        'companyData.status': '',
        'companyData.companyName': '',
        'companyData.location': '',
        'companyData.cbu': '',
        'companyData.actaPhoto': '',
        'companyData.serviceFee': '',
      });
    } else {
      await updateDoc(userRef, {
        isBusiness: true,
        'companyData.status': 'approved',
        'companyData.approvedAt': new Date().toISOString(), // Fecha de aprobación
        'companyData.approvedBy': currentUser.email, // Admin que aprobó
      });
    }

    loadPendingRequests(); // Actualizar solicitudes pendientes
    loadApprovedRequests(); // Actualizar solicitudes aprobadas
    setMessage('La solicitud ha sido aprobada.');
  };

  const handleReject = async (id) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
      isBusiness: false,
      'companyData.status': 'rejected',
    });
    loadPendingRequests(); // Actualizar solicitudes pendientes
  };

  const handleChangeCompanyData = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  const handleChangeCompany3DData = (e) => {
    const { name, value } = e.target;
    setCompany3DData({ ...company3DData, [name]: value });
  };

  const handleToggleCompanyForm = () => {
    setIsCompany(!isCompany);
    setIs3D(false);
  };

  const handleToggle3DServiceForm = () => {
    setIs3D(!is3D);
    setIsCompany(false);
  };

  const handleSubmitCompanyForm = async (e) => {
    e.preventDefault();
    if (currentUser && actaPhoto) {
      try {
        const storageRef = ref(storage, `actasVerification/${currentUser.uid}`);
        await uploadBytes(storageRef, actaPhoto);
        const actaPhotoUrl = await getDownloadURL(storageRef);

        // Guardar datos en Firestore junto con la URL de la foto del acta
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          isBusiness: false, // Comienza como false
          companyData: {
            ...companyData,
            actaPhoto: actaPhotoUrl, // Guardar la URL en Firestore
            status: 'pending',
          },
        });

        setMessage('Su petición está en revisión. Pronto se le aprobará.');
        setIsCompany(false); // Ocultar el formulario después de enviar
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al enviar la solicitud');
      }
    } else {
      alert('Por favor, suba la foto del acta de verificación.');
    }
  };

  const handleSubmitCompany3DForm = async (e) => {
    e.preventDefault();
    if (currentUser && acta3DPhoto) {
      try {
        const storageRef = ref(storage, `actasVerification/${currentUser.uid}`);
        await uploadBytes(storageRef, actaPhoto);
        const actaPhotoUrl = await getDownloadURL(storageRef);

        // Guardar datos en Firestore junto con la URL de la foto del acta
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          is3DBusiness: false, // Comienza como false
          company3DData: {
            ...company3DData,
            actaPhoto: actaPhotoUrl, // Guardar la URL en Firestore
            status: 'pending',
          },
        });

        setMessage('Su petición está en revisión. Pronto se le aprobará.');
        setIs3D(false); // Ocultar el formulario después de enviar
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al enviar la solicitud');
      }
    } else {
      alert('Por favor, suba la foto del acta de verificación 3D.');
    }
  };

  const handleSubmitStopBeingCompany = () => {
    const confirm = window.confirm('¿Estás seguro de que quieres dejar de ser una empresa?');
    if (confirm && currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, {
        'companyData.status': 'pending removal',
      })
        .then(() => {
          setMessage('Su solicitud para dejar de ser empresa está en revisión.');
        })
        .catch((error) => {
          console.error('Error al procesar la solicitud de dejar de ser empresa:', error);
        });
    }
  };

  const AdminView = () => (
    <div className="admin-requests">
      <h3>Solicitudes Pendientes</h3>
      {pendingRequests.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <ul>
          {pendingRequests.map((request) => (
            <li key={request.id}>
              <p>
                Empresa: {request.companyData.companyName} - Estado: {request.companyData.status}
              </p>
              <button onClick={() => handleApprove(request.id)}>Aprobar</button>
              <button onClick={() => handleReject(request.id)}>Rechazar</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Solicitudes Aprobadas</h3>
      {approvedRequests.length === 0 ? (
        <p>No hay solicitudes aprobadas.</p>
      ) : (
        <ul>
          {approvedRequests.map((request) => (
            <li key={request.id}>
              <p>Empresa: {request.companyData.companyName}</p>
              <p>Fecha de aprobación: {new Date(request.companyData.approvedAt).toLocaleString()}</p>
              <p>Aprobado por: {request.companyData.approvedBy}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="user-profile">
      {/* Mostrar pantalla de carga hasta que la info esté lista */}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <>
          {isAdmin ? (
            <AdminView />
          ) : (
            <>
              <div className="header-section">
                <div className="header-left">
                  <img
                    src={profilePhoto || 'https://via.placeholder.com/100'}
                    alt={`${editableUser.name}`}
                    className="photo-header-small rounded-photo"
                  />
                  <div className="header-info">
                    <h2>{editableUser.name}</h2>
                    <p>{editableUser.email}</p>
                    {/* Mostrar estado de la empresa */}
                    {user.companyData?.status === 'pending' && <p>Status: Pendiente</p>}
                    {isBusiness && (
                      <p style={{ color: 'green' }}>Cuenta de empresa: Aprobada</p>
                    )}
                    {user.companyData?.status === 'rejected' && (
                      <p style={{ color: 'red' }}>Cuenta de empresa: Rechazada</p>
                    )}
                  </div>
                </div>
                <button className="delete-account-button" onClick={handleDeleteAccount}>
                  Eliminar Cuenta
                </button>
              </div>

              <div className="spacer"></div>

              {/* User Credentials Section */}
              <div className="user-credentials">
                <h3>Contraseña</h3>
                <div className="detail-item-column">
                  <div className="input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={editableUser.password}
                      onChange={handleChange}
                      disabled={!isEditing.password}
                      placeholder="••••••••"
                    />
                    <button className="toggle-button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                    {isEditing.password ? (
                      <button className="modify-button" onClick={handlePasswordChange}>
                        Guardar
                      </button>
                    ) : (
                      <button className="modify-button" onClick={() => toggleEditing('password')}>
                        Modificar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="personal-info">
                <h3>Datos Personales</h3>
                <div className="profile-photo-large">
                  <img
                    src={profilePhoto || 'https://via.placeholder.com/200'}
                    alt={`${editableUser.name}`}
                    className="photo-large rounded-photo centered-photo"
                  />
                  <div className="photo-buttons">
                    <button className="edit-button-small" onClick={() => document.getElementById('file-upload').click()}>
                      Cargar
                    </button>
                    <button className="save-button-small" onClick={handlePhotoSave}>
                      Guardar
                    </button>
                    <button className="delete-button-small" onClick={handlePhotoDelete}>
                      Eliminar
                    </button>
                    <input id="file-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="upload-button-hidden" />
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-item-column">
                    <label htmlFor="name">Nombre:</label>
                    <div className="input-container">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editableUser.name}
                        onChange={handleChange}
                        disabled={!isEditing.name}
                      />
                      {isEditing.name ? (
                        <button className="modify-button" onClick={handleNameChange}>
                          Guardar
                        </button>
                      ) : (
                        <button className="modify-button" onClick={() => toggleEditing('name')}>
                          Modificar
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="detail-item-column">
                    <label htmlFor="phone">Teléfono:</label>
                    <div className="input-container">
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={editableUser.phone}
                        onChange={handleChange}
                        disabled={!isEditing.phone}
                      />
                      {isEditing.phone ? (
                        <button className="modify-button" onClick={() => toggleEditing('phone')}>
                          Guardar
                        </button>
                      ) : (
                        <button className="modify-button" onClick={() => toggleEditing('phone')}>
                          Modificar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {message && <p className="message">{message}</p>}

              {/* Additional Service Buttons */}
              <div className="create-publication-container">
                <button className="create-publication-button" onClick={() => navigate('/agregarFiesta')}>
                  Crear Publicación
                </button>
              </div>

              <div className="additional-buttons">
                <button className="service-button" onClick={handleToggle3DServiceForm}>
                  {is3D ? 'Ocultar formulario servicios 3D' : 'Ofrecer servicios 3D'}
                </button>
                {isBusiness ? (
                  <button className="service-button" onClick={handleSubmitStopBeingCompany}>
                    Dejar de ser empresa
                  </button>
                ) : (
                  <button className="service-button" onClick={handleToggleCompanyForm}>
                    {isCompany ? 'Ocultar formulario de empresa' : 'Quiero ofrecer servicios como empresa'}
                  </button>
                )}
              </div>

              {/* Formulario de empresa */}
              {isCompany && !isBusiness && (
                <form className="company-form" onSubmit={handleSubmitCompanyForm}>
                  <p>Se lo agregará a la lista de empresas como alternativa. El canon será del 5% por suscripción.</p>

                  <div>
                    <label>Nombre de la Empresa:</label>
                    <input
                      type="text"
                      name="companyName"
                      value={companyData.companyName}
                      onChange={handleChangeCompanyData}
                      required
                    />
                  </div>

                  <div>
                    <label>Ubicación de la Empresa:</label>
                    <input
                      type="text"
                      name="location"
                      value={companyData.location}
                      onChange={handleChangeCompanyData}
                      required
                    />
                  </div>

                  <div>
                    <label>CBU de la cuenta bancaria:</label>
                    <input
                      type="text"
                      name="cbu"
                      value={companyData.cbu}
                      onChange={handleChangeCompanyData}
                      required
                    />
                  </div>

                  <div>
                    <label>Foto del Acta de Verificación:</label>
                    
                    {/* Input de archivo oculto */}
                    <input
                      type="file"
                      id="actaPhotoUpload"
                      style={{ display: 'none' }}
                      onChange={handleActaPhotoUpload}
                      required
                    />

                    {/* Botón estilizado para subir archivo */}
                    <label htmlFor="actaPhotoUpload" className="edit-button-small">
                      {actaFileName || 'Seleccionar archivo'}
                    </label>
                    
                    {/* Mostrar el nombre del archivo seleccionado, si existe */}
                    {actaFileName && <span>Archivo seleccionado: {actaFileName}</span>}
                  </div>

                  <div>
                    <label>Tarifa por sus servicios:</label>
                    <input
                      type="text"
                      name="serviceFee"
                      value={companyData.serviceFee}
                      onChange={handleChangeCompanyData}
                      required
                    />
                  </div>

                  <button type="submit" className="submit-button">Enviar Solicitud</button>
                </form>
              )}
              {/* Formulario de servicio de 3D */}
              {is3D && (
                <form className="company-form" onSubmit={handleSubmitCompany3DForm}>
                  <p>Se lo agregará a la lista de empresas 3D como alternativa. El canon será del 5% por suscripción.</p>

                  <div>
                    <label>Nombre de la Empresa:</label>
                    <input
                      type="text"
                      name="companyName"
                      value={company3DData.companyName}
                      onChange={handleChangeCompany3DData}
                      required
                    />
                  </div>

                  <div>
                    <label>Ubicación de la Empresa:</label>
                    <input
                      type="text"
                      name="location"
                      value={company3DData.location}
                      onChange={handleChangeCompany3DData}
                      required
                    />
                  </div>

                  <div>
                    <label>CBU de la cuenta bancaria:</label>
                    <input
                      type="text"
                      name="cbu"
                      value={company3DData.cbu}
                      onChange={handleChangeCompany3DData}
                      required
                    />
                  </div>

                  <div>
                    <label>Foto del Acta de Verificación:</label>
                    
                    {/* Input de archivo oculto */}
                    <input
                      type="file"
                      id="acta3DPhotoUpload"
                      style={{ display: 'none' }}
                      onChange={handleActa3DPhotoUpload}
                      required
                    />

                    {/* Botón estilizado para subir archivo */}
                    <label htmlFor="acta3DPhotoUpload" className="edit-button-small">
                      {acta3DFileName || 'Seleccionar archivo'}
                    </label>
                    
                    {/* Mostrar el nombre del archivo seleccionado, si existe */}
                    {actaFileName && <span>Archivo seleccionado: {acta3DFileName}</span>}
                  </div>

                  <div>
                    <label>Tarifa por sus servicios:</label>
                    <input
                      type="text"
                      name="serviceFee"
                      value={company3DData.serviceFee}
                      onChange={handleChangeCompany3DData}
                    />
                  </div>

                  <button type="submit" className="submit-button">Enviar Solicitud</button>
                </form>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
