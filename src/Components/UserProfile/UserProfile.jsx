import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './UserProfile.css';
import { getAuth, updatePassword, deleteUser } from 'firebase/auth';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { updateUser } from '../../ReduxToolkit/userSlice';
import { useNavigate } from 'react-router-dom';
import { setFoundPiezasUser, selectFoundPiezasUser } from "../../ReduxToolkit/partySlice";
import Item from '../Items/Item';

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
  const [newPhoto, setNewPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  // Estados de empresa
  const [isCompany, setIsCompany] = useState(false);
  const [companyData, setCompanyData] = useState({
    companyName: '',
    location: '',
    cbu: '',
    actaPhoto: '',
    serviceFee: '',
    status: 'pending',
  });

  // Estados de servicio 3D
  const [is3DService, setIs3DService] = useState(user.is3DService || false);
  const [show3DForm, setShow3DForm] = useState(false);
  const [printerData, setPrinterData] = useState({
    location: '',
    cbu: '',
    printerPhoto: null,
    serviceFee: '',
    status: 'pending',
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [pending3DRequests, setPending3DRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBusiness, setIsBusiness] = useState(user.isBusiness || false);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      getDoc(userRef).then((doc) => {
        if (doc.exists()) {
          setProfilePhoto(doc.data().photoUrl || '');
          setIsBusiness(doc.data().isBusiness || false);
          setIs3DService(doc.data().is3DService || false);

          if (!doc.data().hasOwnProperty('isBusiness')) {
            updateDoc(userRef, { isBusiness: false });
          }

          if (!doc.data().hasOwnProperty('is3DService')) {
            updateDoc(userRef, { is3DService: false });
          }

          if (doc.data().role === 'ADMIN') {
            setIsAdmin(true);
            loadPendingRequests();
            loadApprovedRequests();
            loadPending3DRequests();
          }

          setLoading(false);
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

  const loadPending3DRequests = async () => {
    const q = query(collection(db, 'users'), where('printerData.status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    const pending3DRequestsArray = [];
    querySnapshot.forEach((doc) => {
      pending3DRequestsArray.push({ id: doc.id, ...doc.data() });
    });
    setPending3DRequests(pending3DRequestsArray);
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

  const handleChangeCompanyData = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      setProfilePhoto(URL.createObjectURL(file));
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

  const handleToggleCompanyForm = () => {
    setIsCompany(!isCompany);
  };

  const toggle3DForm = () => {
    setShow3DForm(!show3DForm);
  };

  const handleChange3DData = (e) => {
    const { name, value } = e.target;
    setPrinterData({ ...printerData, [name]: value });
  };

  const handle3DPhotoUpload = (e) => {
    const file = e.target.files[0];
    setPrinterData({ ...printerData, printerPhoto: file });
  };

  const handleSubmit3DForm = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setMessage('Error: Usuario no autenticado. Intente de nuevo.');
      return;
    }

    try {
      if (!printerData.printerPhoto) {
        setMessage('Por favor, suba una foto de la impresora.');
        return;
      }

      const storageRef = ref(storage, `printerPhotos/${currentUser.uid}`);
      await uploadBytes(storageRef, printerData.printerPhoto);
      const photoUrl = await getDownloadURL(storageRef);

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        printerData: {
          ...printerData,
          printerPhoto: photoUrl,
          status: 'pending',
        },
        is3DService: false,
      });

      setMessage('Su solicitud para ofrecer servicios 3D está en revisión.');
      setShow3DForm(false);
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setMessage('Hubo un error al enviar la solicitud. Verifique los permisos y vuelva a intentar.');
    }
  };

  const handleSubmitStopBeing3DService = () => {
    const confirm = window.confirm('¿Estás seguro de que quieres dejar de ofrecer servicios 3D?');
    if (confirm && currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, {
        is3DService: false,
        'printerData.status': 'removed',
      })
        .then(() => {
          setIs3DService(false);
          setMessage('Has dejado de ofrecer servicios 3D.');
        })
        .catch((error) => {
          console.error('Error al dejar de ofrecer servicios 3D:', error);
          setMessage('Hubo un error. Intenta de nuevo.');
        });
    }
  };

  const handleSubmitCompanyForm = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setMessage('Error: Usuario no autenticado. Intente de nuevo.');
      return;
    }

    try {
      if (!newPhoto) {
        setMessage('Por favor, suba el archivo del acta de empresa.');
        return;
      }

      const storageRef = ref(storage, `actasEmpresa/${currentUser.uid}/${newPhoto.name}`);
      await uploadBytes(storageRef, newPhoto);
      const actaPhotoUrl = await getDownloadURL(storageRef);

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        isBusiness: false,
        companyData: {
          ...companyData,
          actaPhoto: actaPhotoUrl,
          status: 'pending',
        },
      });

      setMessage('Su petición está en revisión. Pronto se le aprobará.');
      setIsCompany(false);
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setMessage('Hubo un error al enviar la solicitud. Verifique los permisos y vuelva a intentar.');
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

  const toggleEditing = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
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

  const handleApprove = async (id) => {
    const userRef = doc(db, 'users', id);
    const userDoc = await getDoc(userRef);
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
        'companyData.approvedAt': new Date().toISOString(),
        'companyData.approvedBy': currentUser.email,
      });
    }
    loadPendingRequests();
    loadApprovedRequests();
    setMessage('La solicitud ha sido aprobada.');
  };

  const handleReject = async (id) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
      isBusiness: false,
      'companyData.status': 'rejected',
    });
    loadPendingRequests();
  };

  const handleApprove3D = async (id) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
      is3DService: true,
      'printerData.status': 'approved',
      'printerData.approvedAt': new Date().toISOString(),
      'printerData.approvedBy': currentUser.email,
    });
    loadPending3DRequests();
    setMessage('La solicitud de servicios 3D ha sido aprobada.');
  };

  const handleReject3D = async (id) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
      is3DService: false,
      'printerData.status': 'rejected',
    });
    loadPending3DRequests();
  };

  const handleSearchPiezasUser = async () => {
    if (user.email.length >= 3) {
      const piezasCollection = collection(db, 'piezas');
      const queryPiezaUser = query(piezasCollection, where('email', '==', user.email));

      try {
        const querySnapshotPiezaUser = await getDocs(queryPiezaUser);
        const piezasUser = [];

        querySnapshotPiezaUser.forEach((doc) => {
          piezasUser.push({ id: doc.id, ...doc.data() });
        });

        if (piezasUser.length > 0) {
          dispatch(setFoundPiezasUser(piezasUser));
        } else {
          dispatch(setFoundPiezasUser([]));
        }
      } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
      }
    }
  };

  const piezasUser = useSelector(selectFoundPiezasUser);

  const AdminView = () => (
    <div className="admin-requests">
      <h3>Solicitudes de Empresas Pendientes</h3>
      {pendingRequests.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <ul>
          {pendingRequests.map((request) => (
            <li key={request.id}>
              <p>Empresa: {request.companyData.companyName} - Estado: {request.companyData.status}</p>
              <button onClick={() => handleApprove(request.id)}>Aprobar</button>
              <button onClick={() => handleReject(request.id)}>Rechazar</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Solicitudes de Servicios 3D Pendientes</h3>
      {pending3DRequests.length === 0 ? (
        <p>No hay solicitudes de servicios 3D pendientes.</p>
      ) : (
        <ul>
          {pending3DRequests.map((request) => (
            <li key={request.id}>
              <p>Impresora en: {request.printerData.location} - Estado: {request.printerData.status}</p>
              <button onClick={() => handleApprove3D(request.id)}>Aprobar</button>
              <button onClick={() => handleReject3D(request.id)}>Rechazar</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Solicitudes de Empresas Aprobadas</h3>
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
                    alt={editableUser.name}
                    className="photo-header-small rounded-photo"
                  />
                  <div className="header-info">
                    <h2>{editableUser.name}</h2>
                    <p>{editableUser.email}</p>
                    {user.companyData?.status === 'pending' && <p>Status: Pendiente</p>}
                    {isBusiness && <p style={{ color: 'green' }}>Cuenta de empresa: Aprobada</p>}
                    {user.companyData?.status === 'rejected' && <p style={{ color: 'red' }}>Cuenta de empresa: Rechazada</p>}
                  </div>
                </div>
                <button className="delete-account-button" onClick={handleDeleteAccount}>
                  Eliminar Cuenta
                </button>
              </div>

              <div className="spacer"></div>

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
                    alt={editableUser.name}
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
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="upload-button-hidden"
                    />
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

              <div className="create-publication-container">
                <button className="create-publication-button" onClick={() => navigate('/agregarFiesta')}>
                  Crear Publicación
                </button>
              </div>

              <div className="additional-buttons">
                {is3DService ? (
                  <button className="service-button" onClick={handleSubmitStopBeing3DService}>
                    Dejar de ofrecer servicios 3D
                  </button>
                ) : (
                  <button className="service-button" onClick={toggle3DForm}>
                    {show3DForm ? 'Ocultar formulario' : 'Ofrecer servicios 3D'}
                  </button>
                )}
                {isBusiness ? (
                  <button className="service-button" onClick={handleSubmitStopBeingCompany}>
                    Dejar de ser empresa
                  </button>
                ) : (
                  <button className="service-button" onClick={handleToggleCompanyForm}>
                    {isCompany ? 'Ocultar formulario' : 'Ser empresa'}
                  </button>
                )}
              </div>

              {show3DForm && (
                <form className="company-form" onSubmit={handleSubmit3DForm}>
                  <p>Se lo agregará a la lista de impresoras 3D como alternativa. El canon será del 12% por suscripción.</p>

                  <div>
                    <label>Ubicación:</label>
                    <input type="text" name="location" value={printerData.location} onChange={handleChange3DData} required />
                  </div>

                  <div>
                    <label>CBU de la cuenta bancaria:</label>
                    <input type="text" name="cbu" value={printerData.cbu} onChange={handleChange3DData} required />
                  </div>

                  <div>
                    <label>Foto de la impresora:</label>
                    <input type="file" name="printerPhoto" onChange={handle3DPhotoUpload} required />
                  </div>

                  <div>
                    <label>Tarifa por sus servicios:</label>
                    <input type="text" name="serviceFee" value={printerData.serviceFee} onChange={handleChange3DData} required />
                  </div>

                  <button type="submit" className="submit-button">
                    Enviar Solicitud
                  </button>
                </form>
              )}

              {isCompany && !isBusiness && (
                <form className="company-form" onSubmit={handleSubmitCompanyForm}>
                  <p>Se lo agregará a la lista de empresas como alternativa. El canon será del 12% por suscripción.</p>

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
                    <input type="file" name="actaPhoto" onChange={handlePhotoUpload} required />
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

                  <button type="submit" className="submit-button">
                    Enviar Solicitud
                  </button>
                </form>
              )}

              <button onClick={handleSearchPiezasUser}>Buscar Piezas</button>
              <div className="shopCategory-Parties">
                {piezasUser && piezasUser.length > 0 ? (
                  piezasUser.map((pieza) => (
                    <div key={pieza.id}>
                      <Item
                        id={pieza.id}
                        name={pieza.nombre}
                        image={pieza.image}
                        newPrice={pieza.price}
                        desc={pieza.barrio}
                      />
                    </div>
                  ))
                ) : (
                  <p>No se encontraron piezas.</p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;