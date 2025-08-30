import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
  Visibility,
  VisibilityOff,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useAxios, useAlert } from "../../hooks";
import { schemaUser, type UserFormValues } from "../../models";
import { hanleZodError, errorHelper } from "../../helpers";

type StatusLower = "active" | "inactive";
type StatusAnyCase = StatusLower | "ACTIVE" | "INACTIVE";

export interface UserType {
  id: number;
  username: string;
  email?: string;
  status: StatusLower;
}

const toLowerStatus = (s?: StatusAnyCase): StatusLower =>
  (String(s || "active").toLowerCase() === "inactive" ? "inactive" : "active");

export const UsuariosPage = () => {
  const { showAlert } = useAlert();
  const axios = useAxios();

  const [usuarios, setUsuarios] = useState<UserType[]>([]);
  const [total, setTotal] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [formState, setFormState] = useState<UserFormValues & { status: StatusLower }>(
    {
      username: "",
      password: "",
      confirmPassword: "",
      status: "active",
    }
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"" | StatusLower>("");

  const listUsuariosApi = async () => {
    try {
      setLoading(true);
      const orderBy = sortModel[0]?.field;
      const orderDir = sortModel[0]?.sort;
      const { data } = await axios.get("/users", {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          orderBy,
          orderDir,
          search,
          status: filterStatus || undefined,
        },
      });

      const norm: UserType[] = (data?.data || []).map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        status: toLowerStatus(u.status),
      }));

      setUsuarios(norm);
      setTotal(Number(data?.total ?? norm.length));
    } catch (error) {
      showAlert(errorHelper(error), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listUsuariosApi();
  }, [paginationModel, sortModel, search, filterStatus]);

  const handleOpenDialog = (usuario?: UserType) => {
    setShowPassword(false);
    setShowConfirmPassword(false);

    if (usuario) {
      setCurrentUser(usuario);
      setFormState({
        username: usuario.username,
        password: "",
        confirmPassword: "",
        status: toLowerStatus(usuario.status),
      });
    } else {
      setCurrentUser(null);
      setFormState({
        username: "",
        password: "",
        confirmPassword: "",
        status: "active",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveUser = async () => {
    try {
      if (currentUser?.id) {
        if (formState.password.trim() || formState.confirmPassword.trim()) {
          schemaUser.parse({
            username: formState.username,
            password: formState.password,
            confirmPassword: formState.confirmPassword,
          });
        } else {
          if (!formState.username.trim()) throw new Error("El username es requerido.");
        }
      } else {
        schemaUser.parse({
          username: formState.username,
          password: formState.password,
          confirmPassword: formState.confirmPassword,
        });
      }

      const payloadCreate = {
        username: formState.username,
        password: formState.password,
        status: toLowerStatus(formState.status),
      };

      const payloadUpdate: any = {
        username: formState.username,
      };
      if (formState.password.trim()) payloadUpdate.password = formState.password;

      if (currentUser?.id) {
        await axios.put(`/users/${currentUser.id}`, payloadUpdate);

        if (toLowerStatus(currentUser.status) !== toLowerStatus(formState.status)) {
          await axios.patch(`/users/${currentUser.id}`, { status: toLowerStatus(formState.status) });
        }

        showAlert("Usuario actualizado", "success");

        await listUsuariosApi();
      } else {
        const postRes = await axios.post("/users", payloadCreate);
        showAlert("Usuario creado", "success");

        const created = postRes?.data;
        if (created && created.id) {
          const newUser: UserType = {
            id: created.id,
            username: created.username ?? formState.username,
            email: created.email ?? undefined,
            status: toLowerStatus(created.status ?? payloadCreate.status),
          };
          setUsuarios((prev) => [newUser, ...prev]);
          setTotal((t) => t + 1);
        } else {
          await listUsuariosApi();
        }
      }

      handleCloseDialog();
    } catch (error) {
      const err = hanleZodError<UserFormValues>(
        error,
        {
          username: formState.username,
          password: formState.password,
          confirmPassword: formState.confirmPassword,
        }
      );
      showAlert(err.message, "error");
    }
  };

  const handleDeleteUser = async (id: number) => {
    const confirmed = window.confirm("¿Seguro de eliminar este usuario?");
    if (!confirmed) return;

    try {
      await axios.delete(`/users/${id}`);
      showAlert("Usuario eliminado", "success");
      await listUsuariosApi();
    } catch (error) {
      showAlert(errorHelper(error), "error");
    }
  };

  const handleToggleStatus = async (id: number, status: StatusAnyCase) => {
    const confirmed = window.confirm("¿Seguro de cambiar el estado del usuario?"); 
    if (!confirmed) return;

    try {
      const current = toLowerStatus(status);
      const newStatus: StatusLower = current === "active" ? "inactive" : "active";
      await axios.patch(`/users/${id}`, { status: newStatus });
      showAlert("Estado del usuario actualizado", "success");
      await listUsuariosApi();
    } catch (error) {
      showAlert(errorHelper(error), "error");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "username", headerName: "Usuario", flex: 1 },
    {
      field: "status",
      headerName: "Estado",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const st: StatusLower = toLowerStatus(params.value as StatusAnyCase);
        return (
          <Chip
            label={st === "active" ? "Activo" : "Inactivo"}
            color={st === "active" ? "success" : "default"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      filterable: false,
      width: 220,
      renderCell: (params: GridRenderCellParams) => {
        const st: StatusLower = toLowerStatus(params.row.status);
        return (
          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={() => handleOpenDialog(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color={st === "active" ? "success" : "warning"}
              onClick={() => handleToggleStatus(params.row.id, st)}
            >
              {st === "active" ? (
                <ActiveIcon fontSize="small" />
              ) : (
                <InactiveIcon fontSize="small" />
              )}
            </IconButton>

            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteUser(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Usuarios
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          placeholder="Buscar por usuario..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          sx={{ width: 200 }}
          label="Estado"
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="active">Activo</MenuItem>
          <MenuItem value="inactive">Inactivo</MenuItem>
        </TextField>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Usuario
        </Button>
      </Stack>

      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={usuarios}
          columns={columns}
          rowCount={total}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          loading={loading}
          pageSizeOptions={[5, 10, 20]}
          disableColumnFilter
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentUser ? "Editar Usuario" : "Nuevo Usuario"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Usuario"
            fullWidth
            margin="dense"
            required
            value={formState.username}
            onChange={(e) =>
              setFormState({ ...formState, username: e.target.value })
            }
          />

          <TextField
            label="Password"
            fullWidth
            margin="dense"
            type={showPassword ? "text" : "password"}
            value={formState.password}
            onChange={(e) =>
              setFormState({ ...formState, password: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="mostrar/ocultar contraseña"
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar Password"
            fullWidth
            margin="dense"
            type={showConfirmPassword ? "text" : "password"}
            value={formState.confirmPassword}
            onChange={(e) =>
              setFormState({ ...formState, confirmPassword: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="mostrar/ocultar confirmación contraseña"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="Estado"
            fullWidth
            margin="dense"
            value={formState.status}
            onChange={(e) =>
              setFormState({
                ...formState,
                status: toLowerStatus(e.target.value as StatusAnyCase),
              })
            }
          >
            <MenuItem value="active">Activo</MenuItem>
            <MenuItem value="inactive">Inactivo</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {currentUser ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
